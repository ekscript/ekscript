/**
* ===================================
* C Generator backend for EkScript
* --- 
* This is the C Generator Backend for EkScript 
* ===================================
* */

import {
  ArrayNode,
  AssignmentExpressionNode,
  BigIntNode,
  BinaryExpressionNode,
  BooleanNode,
  CharNode,
  ElseClauseNode,
  EmptyStatementNode,
  ExpressionStatementNode,
  FloatNode,
  ForStatementNode,
  IdentifierNode,
  IfStatementNode,
  IntNode,
  LexicalDeclarationNode,
  MemberExpressionNode,
  ObjectNode,
  ParenthesizedExpressionNode,
  ProgramNode,
  PropertyIdentifierNode,
  ScopeContainer,
  SequenceExpressionNode,
  StatementBlockNode,
  StringNode,
  SubscriptExpressionNode,
  SubVariableType,
  SwitchCaseNode,
  SwitchStatementNode,
  SyntaxNode,
  Tree,
  TypeAnnotationNode,
  TypeAliasDeclarationNode,
  UnaryExpressionNode,
  ValueNode,
  VariableDeclaratorNode,
  WhileStatementNode,
} from 'tree-sitter-ekscript';
import { FuncGenType, TCompilerError, Visitor } from 'types/compiler';

import {
  matchLiteralType,
  stitchFunctions,
} from '../utils/codegenResolverUtils';
import { loopNamedNodeChild, loopNodeChildren } from '../utils/iterators';
import { removeUnderscore } from '../utils/number';
import { TCompilerErrorType } from '../compiler/errorHandler';
import { visitBinaryExpr } from './binaryExprGen'

import { generateFromGenerators } from './constantFunctions';

// TODO: Uncomment later
// import { generateArrayUtils } from './constantFunctions';
// import { getArrayName } from './utils/misc';

// TODO: uncomment later
// import { genStringUtil } from './utils/utils1';
// --------------------------------------------
class CodeGen implements Visitor<SyntaxNode> {
  private utils: string[] = [];

  // only named as 'stdbool', 'string' etc
  private includes: string[] = [];
  private alreadyImportedIncludes: Set<string> = new Set<string>();

  private _singleLineStart = false;
  private currLine: string[] = [];
  private indentLevel = 0;

  private functions: FuncGenType[] = [];
  currentFunc: FuncGenType = {
    name: 'main',
    returnType: 'int',
    body: [],
    funcArgs: [
      ['int', 'argc'],
      ['char', '**argv'],
    ],
    destructors: [],
  };
  numTempVars = 0;

  currentScope: ScopeContainer;

  private specialFlag = false;
  private specialLine: string[] = [];

  constructor(
    private ast: Tree,
    private errors: TCompilerError[] = [],
    private warnings: TCompilerError[] = [],
    private generators: Map<string, SubVariableType>
  ) {
    this.currentScope = this.ast.rootNode as ScopeContainer;
  }

  get singleLineStart() {
    return this._singleLineStart;
  }

  set singleLineStart(v: boolean) {
    this._singleLineStart = v;
    if (v == false) this.currLine = [];
  }

  printAst() {
    console.log(this.ast.rootNode.toString());
  }

  compileToC(ast?: Tree): string {
    if (ast) this.ast = ast;
    this.visit(this.ast.rootNode);
    return this.getFinalCode();
  }

  getFinalCode = () => {
    const stiched = stitchFunctions(this.functions);
    return [
      ...this.includes,
      generateFromGenerators(this.generators),
      ...this.utils,
      stiched,
    ].join('\n');
  };

  addLine() {
    if (!this.specialFlag) {
      if (this.currLine.length != 0) {
        this.currentFunc.body.push(this.indent + this.currLine.join(' '));
      }
      this.singleLineStart = false;
    }
  }

  addCol(col: string) {
    if (this.singleLineStart && col.length != 0) {
      if (this.specialFlag) {
        this.specialLine.push(col);
      } else {
        this.currLine.push(col);
      }
    }
  }

  addInclude = (lib: string) => {
    if (!this.alreadyImportedIncludes.has(lib)) {
      this.includes.push(`#include<${lib}.h>`);
      this.alreadyImportedIncludes.add(lib);
    }
  };

  addUtils = (line: string) => this.utils.push(line);

  addError(node: SyntaxNode, errorMessage: string) {
    this.errors.push({
      line: node.startPosition.row ?? 0,
      pos: node.startPosition.column ?? 0,
      errorMessage,
      errorType: TCompilerErrorType.COMPILE_ERROR,
    });
  }

  addWarning(node: SyntaxNode, errorMessage: string) {
    this.warnings.push({
      line: node.startPosition.row ?? 0,
      pos: node.startPosition.column ?? 0,
      errorMessage,
      errorType: TCompilerErrorType.COMPILE_ERROR,
    });
  }

  get indent() {
    let indentStr = '';
    for (let i = 0; i < this.indentLevel; i++) indentStr += '  ';
    return indentStr;
  }

  // ----------- all the visitors ---------
  visit(node: SyntaxNode) {
    switch (node.type) {
      case 'program': {
        this.visitProgram(node as ProgramNode);
        break;
      }
      case 'comment': {
        break;
      }
      case 'expression_statement':
        this.visitExprStmt(node as ExpressionStatementNode);
        break;
      case 'binary_expression':
        this.visitBinaryExpr(node as BinaryExpressionNode);
        break;
      case 'statement_block': {
        this.visitStmtBlock(node as StatementBlockNode);
        break;
      }
      case 'while_statement': {
        this.visitWhileStmt(node as WhileStatementNode);
        break;
      }
      case 'for_statement': {
        this.visitForStmt(node as ForStatementNode);
        break;
      }
      case 'switch_statement': {
        this.visitSwitchStmt(node as SwitchStatementNode);
        break;
      }
      case 'break_statement': {
        this.visitBreakStmt();
        break;
      }
      case ';':
        break;
      case 'int_literal': {
        this.visitInt(node as IntNode);
        break;
      }
      case 'float_literal': {
        this.visitFloat(node as FloatNode);
        break;
      }
      case 'char': {
        this.visitChar(node as CharNode);
        break;
      }
      case 'parenthesized_expression': {
        this.visitParenExpr(node as ParenthesizedExpressionNode);
        break;
      }
      case 'unary_expression': {
        this.visitUnaryExpr(node as UnaryExpressionNode);
        break;
      }
      case 'assignment_expression': {
        this.visitAssignmentExpr(node as AssignmentExpressionNode);
        break;
      }
      case 'sequence_expression': {
        this.visitSeqExpr(node as SequenceExpressionNode);
        break;
      }
      case 'identifier': {
        this.visitIdentifier(node as IdentifierNode);
        break;
      }
      case 'false':
      case 'true': {
        this.visitBoolean(node as BooleanNode);
        break;
      }
      case 'if_statement': {
        this.visitIfStmt(node as IfStatementNode);
        break;
      }
      case 'else_clause': {
        this.visitElseClause(node as ElseClauseNode);
        break;
      }
      case 'string': {
        this.visitString(node as StringNode);
        break;
      }
      case 'array': {
        this.visitArray(node as ArrayNode);
        break;
      }
      case 'object': {
        this.visitObject(node as ObjectNode);
        break;
      }
      case 'lexical_declaration': {
        this.visitLexicalDecl(node as LexicalDeclarationNode);
        break;
      }
      case 'type_alias_declaration': {
        this.visitTypeAliasDeclaration(node as TypeAliasDeclarationNode);
        break;
      }
      default: {
        console.log('--->', node?.toString());
        throw new Error('Error compiling some weird shit!');
      }
    }
  }

  visitProgram(node: ProgramNode) {
    this.currentScope = node;
    this.indentLevel++;

    if (node.childCount == 0) {
      this.singleLineStart = true;
      this.addCol('return 0 ;');
      this.addLine();
      this.functions.push(this.currentFunc);
      return;
    }

    for (const { child } of loopNodeChildren(node)) this.visit(child);
    this.addDestructors(node);
    this.currentFunc.destructors.push(this.indent + 'return 0;');
    this.indentLevel--;
    this.functions.push(this.currentFunc);
  }

  // ------ Statements Visitor --------
  visitExprStmt(node: ExpressionStatementNode, nextLine = true) {
    this.singleLineStart = true;
    for (const { child } of loopNamedNodeChild(node)) {
      this.visit(child);
    }
    this.addCol(';');
    if (nextLine) this.addLine();
  }

  visitIfStmt(node: IfStatementNode) {
    this.singleLineStart = true;
    this.addCol('if');

    this.visitParenExpr(node.conditionNode);

    if (node.consequenceNode.type == 'statement_block') {
      this.visitStmtBlock(node.consequenceNode);
    } else {
      this.addCol('{');
      this.addLine();
      this.indentLevel++;
      this.singleLineStart = true;
      this.visit(node.consequenceNode);
      this.indentLevel--;
      this.singleLineStart = true;
      this.addCol('}');
    }

    if (node.alternativeNode == null) this.addLine();
    for (const { child } of loopNamedNodeChild(node)) {
      if (child.type == 'else_clause') {
        this.singleLineStart = true;
        this.addCol('else');
        this.visitElseClause(child as ElseClauseNode);
        this.addLine();
      }
    }
  }

  visitElseClause(node: ElseClauseNode) {
    this.currentScope = node;
    const consequence = node.firstNamedChild!;
    this.addCol('{');
    this.addLine();
    this.indentLevel++;
    if (consequence.type == 'expression_statement') {
      this.singleLineStart = true;
      this.visitExprStmt(consequence as ExpressionStatementNode);
      this.singleLineStart = true;
    } else {
      this.visit(consequence);
    }
    this.addDestructors(node);
    this.indentLevel--;
    this.singleLineStart = true;
    this.addCol('}');
    this.addLine();
  }

  visitWhileStmt(node: WhileStatementNode) {
    this.singleLineStart = true;
    this.addCol('while');
    this.visitParenExpr(node.conditionNode);

    if (node.bodyNode.type == 'statement_block') {
      this.visitStmtBlock(node.bodyNode as StatementBlockNode);
      this.addLine();
    } else {
      this.addLine();
      this.indentLevel++;
      this.singleLineStart = true;
      this.visit(node.bodyNode);
      this.indentLevel--;
    }
  }

  visitForStmt(node: ForStatementNode) {
    this.currentScope = node;

    const initializer = node.initializerNode;
    const condition = node.conditionNode;
    const increment = node.incrementNode;
    const body = node.bodyNode;

    this.singleLineStart = true;
    this.addCol('{');
    this.addLine();
    this.indentLevel++;
    this.singleLineStart = true;

    switch (initializer.type) {
      case 'empty_statement': {
        this.addCol('for ( ;');
        break;
      }
      case 'variable_declaration':
      case 'lexical_declaration': {
        this.visitLexicalDecl(initializer as LexicalDeclarationNode);
        this.singleLineStart = true;
        this.addCol('for ( ;');
        break;
      }
      case 'expression_statement': {
        this.visitExprStmt(initializer, false);
        break;
      }
      default:
    }

    if (condition.type == 'empty_statement') this.addCol(';');
    else if (condition.type == 'expression_statement')
      this.visitExprStmt(condition, false);

    this.visit(increment as SyntaxNode);

    this.addCol(') {');
    this.addLine();

    // statement block
    this.visit(body);
    this.addLine();

    this.addDestructors(node);

    this.indentLevel--;

    this.singleLineStart = true;
    this.addCol('}');
    this.addLine();
  }

  visitEmptyStmt(_node: EmptyStatementNode, newLine = true) {
    this.addCol(';');
    if (newLine) this.addLine();
  }

  visitStmtBlock(node: StatementBlockNode) {
    this.currentScope = node;
    this.addCol('{');
    this.addLine();
    this.indentLevel++;

    for (const { child } of loopNamedNodeChild(node)) this.visit(child);
    this.currentScope = node;
    this.addDestructors(node);

    this.indentLevel--;
    this.singleLineStart = true;
    this.addCol('}');
  }

  visitSwitchStmt(node: SwitchStatementNode) {
    this.singleLineStart = true;
    this.addCol('switch');
    this.visit(node.valueNode);
    this.addCol('{');
    this.addLine();
    this.indentLevel++;

    const body = node.bodyNode;
    for (const { child } of loopNamedNodeChild<SwitchCaseNode>(body)) {
      this.singleLineStart = true;

      if (child.type == 'switch_case') {
        const consequence =
          child.namedChildCount > 1 ? child.lastNamedChild : null;
        this.addCol('case');
        this.visit(child.valueNode);
        this.addCol(':');
        if (consequence) this.visit(consequence);
      } else {
        this.addCol('default :');
        if (child.namedChildCount == 0) this.addCol(';');
        else this.visit(child.lastNamedChild!);
      }
      this.addLine();
    }

    this.indentLevel--;
    this.singleLineStart = true;
    this.addCol('}');
    this.addLine();
  }

  visitBreakStmt() {
    this.singleLineStart = true;
    this.addCol('break ;');
    this.addLine();
  }

  // ------ Declarations -----------
  // TODO: identifier type through the syntaxnode.
  // cases: let i; let i: string; let i = 'hello'; let i: string = 'hello';
  // let i: string = 'hello', i: int = 1
  visitLexicalDecl(node: LexicalDeclarationNode) {
    for (const { child } of loopNamedNodeChild(node))
      this.visitVariableDeclarator(child as VariableDeclaratorNode);
  }

  visitVariableDeclarator(node: VariableDeclaratorNode) {
    this.singleLineStart = true;

    if (node.isConst) {
      if (node.variableType != 'array' && node.variableType != 'object')
        this.addCol('const');
    }

    const { nameNode, valueNode } = node;
    const idName = nameNode.text;

    if (valueNode?.variableType == 'boolean') this.addInclude('stdbool');

    if (node.variableType == 'array') {
      this.addInclude('stdlib');
      // @ts-ignore
      const array_name = node.subVariableType?.typeAlias;
      this.addCol(`${array_name}`);
    } else if (node.variableType == 'object') {
      const typeAlias = node?.subVariableType?.typeAlias;
      this.addCol(typeAlias + '*');
    } else {
      if (node.variableType == 'boolean') this.addCol('bool');
      else this.addCol(node.variableType);
    }

    this.addCol(idName);
    this.addCol('=');

    if (valueNode != null) {
      if (
        matchLiteralType(valueNode.type) ||
        valueNode.type == 'identifier' ||
        valueNode.type == 'parenthesized_expression'
      ) {
        if (valueNode.type == 'string') this.addInclude('ekstr');
        this.visit(valueNode);
      } else {
        // for arrays and objects
        if (
          valueNode.type == 'binary_expression' &&
          valueNode.variableType == 'string'
        ) {
          const { rightNode, leftNode } = valueNode;
          if (rightNode.type == 'identifier' || leftNode.type == 'identifier') {
            this.currentScope.destructors[idName] = 'string';
          }
        }
        this.visit(valueNode);
      }
    } else {
      console.error(':549: ', 'ERROR. valueNode == null');
    }

    this.addCol(';');
    this.addLine();
  }

  visitTypeAnnotation(node: TypeAnnotationNode) {
    node;
    // visitTypeAnnotation(this, node);
  }

  visitTypeAliasDeclaration(node: TypeAliasDeclarationNode) {
    this.singleLineStart = true;
    const { variableType, nameNode } = node;
    this.addCol(`typedef ${variableType} ${nameNode.text} ;`)
    this.addLine();
  }

  // ------ Expression visitor -------
  visitAssignmentExpr(node: AssignmentExpressionNode) {
    const { leftNode, rightNode } = node;
    this.visit(leftNode);
    this.addCol('=');
    if (rightNode.type == 'string') {
      this.addCol(
        `init_string ( ${rightNode.text}, ${rightNode.text.length - 2} )`
      );
    } else {
      this.visit(rightNode);
    }
  }

  visitBinaryExpr(node: BinaryExpressionNode) {
    visitBinaryExpr(this, node);    
  }

  visitParenExpr(node: ParenthesizedExpressionNode) {
    this.addCol('(');
    this.visit(node.firstNamedChild!);
    this.addCol(')');
  }

  visitUnaryExpr(node: UnaryExpressionNode) {
    this.addCol(node?.child(0)?.text!);
    this.addCol(node?.child(1)?.text!);
  }

  visitSeqExpr(node: SequenceExpressionNode) {
    this.visit(node.leftNode);
    this.addCol(',');
    this.visit(node.rightNode);
  }

  visitSubscriptExpr(node: SubscriptExpressionNode) {
    console.log(':608:subscript: ', node.toString());
  }

  visitMemberExpr(node: MemberExpressionNode) {
    console.log('member expr:', node.toString());
  }

  visitPropertyIdentifier(node: PropertyIdentifierNode) {
    console.log('prop identifier:', node.toString());
  }

  // ----- literal and identifier -----
  visitArray(node: ArrayNode) {
    this.singleLineStart = true;

    this.addInclude('stdlib');

    // HERE IS THE ERROR
    const array_name = node.subVariableType.typeAlias;

    const varName = `temp${this.numTempVars++}`;

    this.addToCurrentFunc(
      `${array_name} ${varName} = init_${array_name} ( ${node.namedChildCount} ) ;`
    );

    for (const { child, i } of loopNamedNodeChild(node)) {
      this.visit(child);
      this.addToCurrentFunc(
        `${varName}.value[${i}] = ${this.currLine.pop()} ;`
      );
    }

    this.addCol(varName);
  }

  visitObject(node: ObjectNode) {
    const objectType = node?.subVariableType?.typeAlias;

    if (objectType) {
      const varName = `temp${this.numTempVars++}`;

      this.addToCurrentFunc(
        `${objectType}* ${varName} = init_${objectType} () ;`
      );
      // this.addCol(`init_${} (`);

      for (const { child } of loopNamedNodeChild(node)) {
        const key = child.firstNamedChild;
        const value = child.lastNamedChild;
        if (value != null && key != null) {
          if (value) this.visit(value);
          this.addToCurrentFunc(
            `${varName}->${key.text} = ${this.currLine.pop()} ;`
          );
        } else {
          this.addError(child, 'key/value might possibly be null');
        }
      }
      this.addCol(varName);
    } else {
      this.addError(node, 'Object type not declared. Error while generation');
    }
  }

  visitChar(node: CharNode) {
    this.addCol(node?.text!);
  }

  visitInt(node: IntNode) {
    this.addCol(removeUnderscore(node?.text!));
  }

  visitBigInt(node: BigIntNode) {
    this.addCol(removeUnderscore(node?.text!));
  }

  visitFloat(node: FloatNode) {
    this.addCol(removeUnderscore(node?.text!));
  }

  visitBoolean(node: BooleanNode) {
    this.addInclude('stdbool');
    this.addCol(node.text!);
  }

  addString(str: string, varName: string) {
    this.addInclude('ekstr');
    this.currentFunc.body.push(
      `${this.indent}const string ${varName} = init_string ( ${str}, ${
        str.length - 2
      } ) ;`
    );
    this.currentScope.destructors[varName] = 'string';
  }

  addToCurrentFunc(str: string) {
    this.currentFunc.body.push(this.indent + str);
  }

  visitString(node: StringNode) {
    const varName = `temp${this.numTempVars++}`;
    this.addString(node.text, varName);
    this.addCol(varName);
  }

  visitIdentifier(node: IdentifierNode) {
    this.addCol(node.text);
  }

  // ----- utils ----------
  addDestructors(node: ScopeContainer) {
    for (const varName in node.destructors) {
      this.singleLineStart = true;
      this.addCol(`destroy_${node.destructors[varName]} ( ${varName} ) ;`);
      this.addLine();
    }
  }
}

export default CodeGen;
