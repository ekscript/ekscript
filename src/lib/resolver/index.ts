/**
 * ===================================================
 * Resolver is many things.
 * But first and foremost, it contains the type-checker
 * And the semantic analyzer
 * Further, visitors simplify the calls for each nodes
 *  and return the simplified value
 * ===================================================
 * */

// ---- lib imports
import {
  ArrayNode,
  AssignmentExpressionNode,
  BigIntNode,
  BinaryExpressionNode,
  BreakStatementNode,
  CharNode,
  EmptyStatementNode,
  ExpressionStatementNode,
  FalseNode,
  FloatNode,
  ForStatementNode,
  IdentifierNode,
  IfStatementNode,
  IntNode,
  IVarKind,
  LexicalDeclarationNode,
  MemberExpressionNode,
  ObjectNode,
  PairNode,
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
  TrueNode,
  TypeAnnotationNode,
  UnaryExpressionNode,
  ValueNode,
  VariableDeclaratorNode,
  WhileStatementNode,
} from 'tree-sitter-ekscript';
import { TCompilerError, Visitor } from 'types/compiler';

import {
  compareVariableTypes,
  getEnvValueRecursively,
  isComparisionOperator,
} from '../../utils/codegenResolverUtils';
import { loopNamedNodeChild } from '../../utils/iterators';
import { TCompilerErrorType } from '../compiler/errorHandler';

// -------------------
export default class Resolver implements Visitor<SyntaxNode> {
  private currentScope: ScopeContainer;

  constructor(
    private tree: Tree,
    private errors: TCompilerError[],
    private warnings: TCompilerError[]
  ) {
    this.currentScope = this.tree.rootNode as ProgramNode;
  }

  // --------- visit --------------
  visit(node: SyntaxNode) {
    switch (node.type) {
      case 'program': {
        this.visitProgram(node as ProgramNode);
        break;
      }
      case 'comment': {
        break;
      }
      case 'expression_statement': {
        this.visitExprStmt(node as ExpressionStatementNode);
        break;
      }
      case 'if_statement': {
        this.visitIfStmt(node as IfStatementNode);
        break;
      }
      case 'while_statement': {
        this.visitWhileStmt(node as WhileStatementNode);
        break;
      }
      case 'empty_statement': {
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
      case 'binary_expression':
        this.visitBinaryExpr(node as BinaryExpressionNode);
        break;
      case 'int_literal': {
        this.visitInt(node as IntNode);
        break;
      }
      case 'bigint_literal': {
        this.visitBigInt(node as BigIntNode);
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
      case 'array': {
        this.visitArray(node as ArrayNode);
        break;
      }
      case 'object': {
        this.visitObject(node as ObjectNode);
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
      case 'subscript_expression': {
        this.visitSubscriptExpr(node as SubscriptExpressionNode);
        break;
      }
      case 'member_expression': {
        this.visitMemberExpr(node as MemberExpressionNode);
        break;
      }
      case 'identifier': {
        this.visitIdentifier(node as IdentifierNode);
        break;
      }
      case 'property_identifier': {
        this.visitPropertyIdentifier(node as PropertyIdentifierNode);
        break;
      }
      case 'boolean':
      case 'false':
      case 'true': {
        this.visitBoolean(node as TrueNode | FalseNode);
        break;
      }
      case 'string': {
        this.visitString(node as StringNode);
        break;
      }
      case 'lexical_declaration': {
        this.visitLexicalDecl(node as LexicalDeclarationNode);
        break;
      }
      case 'statement_block': {
        this.visitStmtBlock(node as StatementBlockNode);
        break;
      }
      case 'break_statement': {
        this.visitBreakStmt(node as BreakStatementNode);
        break;
      }
      case 'type_annotation': {
        this.visitTypeAnnotation(node as TypeAnnotationNode);
        break;
      }
      default: {
        console.log('-->', node.toString());
        throw new Error('Error compiling some weird shit!');
      }
    }
  }

  visitEmptyStmt(node: EmptyStatementNode) {
    // placeholder
    node;
  }

  visitProgram(node: ProgramNode) {
    node.destructors = {};
    node.env = {};
    this.currentScope = node;
    for (const { child } of loopNamedNodeChild(node)) this.visit(child);
  }

  // ---- statements
  visitExprStmt(node: ExpressionStatementNode) {
    if (node.namedChildCount > 0) {
      this.visit(node.firstNamedChild!);
      node.variableType = node.firstNamedChild?.variableType!;
    } else {
      node.variableType = 'void';
    }
  }

  visitIfStmt(node: IfStatementNode) {
    const condition = node.conditionNode as ParenthesizedExpressionNode;
    const ifConsequence = node.consequenceNode;
    this.visit(condition);
    const vType = condition.variableType;
    if (vType != 'boolean' && vType != 'true' && vType != 'false') {
      this.addError(condition, `Only boolean expressions allowed`);
    }
    this.visit(ifConsequence);
    for (const { child } of loopNamedNodeChild(node)) {
      switch (child.type) {
        case 'parenthesized_expression':
        case 'statement_block':
          continue;
        case 'else_clause':
          this.visit(child.firstNamedChild!);
          break;
        default:
      }
    }
  }

  visitStmtBlock(node: StatementBlockNode) {
    node.destructors = {};
    node.env = {};
    this.currentScope = node;
    for (const { child } of loopNamedNodeChild(node)) this.visit(child);
  }

  visitWhileStmt(node: WhileStatementNode) {
    const condition = node.conditionNode;
    this.visit(condition);
    const vType = condition.variableType;
    if (vType != 'boolean' && vType != 'true' && vType != 'false') {
      this.addError(condition, `Only boolean expressions allowed`);
    }
    this.visit(node.bodyNode);
  }

  visitForStmt(node: ForStatementNode) {
    this.currentScope = node;

    const initializerNode = node.initializerNode;
    const conditionNode = node.conditionNode;
    const updateNode = node.incrementNode;
    const body = node.bodyNode;

    node.env = {};
    node.destructors = {};

    this.visit(initializerNode);

    if (conditionNode.type == 'expression_statement') {
      this.visit(conditionNode);
      const vType = conditionNode.variableType;
      if (vType != 'boolean' && vType != 'true' && vType != 'false')
        this.addError(conditionNode, `Only boolean expressions allowed`);
    }

    if (updateNode != null) this.visit(updateNode);
    this.visit(body);
  }

  visitSwitchStmt(node: SwitchStatementNode) {
    const value = node.valueNode;
    this.visit(value);
    node.variableType = value.variableType;

    const body = node.bodyNode;
    for (const { child } of loopNamedNodeChild<SwitchCaseNode>(body)) {
      const consequence =
        child.namedChildCount > 1 ? child.lastNamedChild : null;
      if (child.type == 'switch_case') {
        const caseVal = child.valueNode;
        this.visit(caseVal);
        if (caseVal.variableType != value.variableType) {
          this.addError(caseVal, 'Incompatible types switch value and case');
        }
      }
      if (consequence) this.visit(consequence);
    }
  }

  // TODO: Improve upon this for various other declarations
  // - [ ] Functions
  // - [ ] Arrow Functions
  // - [ ] Class Decl
  visitBreakStmt(node: BreakStatementNode) {
    let flag = false;
    const recValid = (node: SyntaxNode) => {
      switch (node.type) {
        case 'switch_case':
        case 'switch_default':
        case 'while_statement':
        case 'for_statement': {
          flag = true;
          return;
        }
        case 'function_declaration': {
          flag = false;
          return;
        }
        default: {
          // @ts-ignore
          if (node.parent) recValid(node.parent);
        }
      }
    };
    recValid(node);
    if (flag == false) {
      this.addError(
        node,
        'break is only present inside for, while, do-while and switch-case'
      );
    }
  }

  //  ---- identifiers & literals
  visitInt(node: IntNode) {
    node.variableType = 'int';
  }

  visitBoolean(node: TrueNode | FalseNode) {
    node.variableType = 'boolean';
  }

  visitFloat(node: FloatNode) {
    node.variableType = 'float';
  }

  visitBigInt(node: BigIntNode) {
    node.variableType = 'bigint';
  }

  visitChar(node: CharNode) {
    node.variableType = 'char';
  }

  visitString(node: StringNode) {
    node.variableType = 'string';
    // TODO: modify multilined strings to single lined
  }

  visitIdentifier(node: IdentifierNode) {
    const id = getEnvValueRecursively(node.text, node);
    if (id == null) this.addError(node, 'Undefined variable');
    else {
      node.variableType = id.variableType;
      node.subVariableType = id.subVariableType!;
      node.isConst = id.isConst;
    }
  }

  visitPropertyIdentifier(node: PropertyIdentifierNode) {
    console.log('prop:', node.toString());
  }

  visitArray(node: ArrayNode) {
    node.variableType = 'array';
    const subVariableType: SubVariableType = {
      subTypes: [],
      variableType: 'array',
    };

    if (node.namedChildCount == 0) {
      return;
    }

    const fieldTypes = new Set<string>();
    for (const { child } of loopNamedNodeChild(node)) {
      this.visit(child);
      if (child.variableType == 'array') {
        if ((child as ValueNode).subVariableType) {
          fieldTypes.add(JSON.stringify((child as ValueNode).subVariableType));
        }
      } else {
        fieldTypes.add(child.variableType);
      }
    }

    if (fieldTypes.size != 0) {
      for (const str of fieldTypes) {
        if (str.charAt(0) == '{') {
          subVariableType.subTypes?.push(JSON.parse(str) as SubVariableType);
        } else {
          subVariableType.subTypes?.push(str);
        }
      }
    }
    node.subVariableType = subVariableType;
  }

  visitObject(node: ObjectNode) {
    const subVariableType: SubVariableType = {
      subTypes: [],
      variableType: 'object',
      fields: {},
    };
    for (const { child } of loopNamedNodeChild(node)) {
      const { keyNode, valueNode } = child as PairNode;
      this.visit(valueNode);
      const subVarType: SubVariableType | string = valueNode.variableType;
      switch (subVarType) {
        case 'object':
        case 'array':
          subVariableType.fields![keyNode.text] = valueNode.subVariableType!;
          break;
        default:
          subVariableType.fields![keyNode.text] = subVarType;
      }
      (child as ValueNode).variableType = valueNode.variableType;
      (child as ValueNode).subVariableType = valueNode.subVariableType;
      (keyNode as ValueNode).variableType = valueNode.variableType;
      (keyNode as ValueNode).subVariableType = valueNode.subVariableType;
    }
    node.variableType = 'object';
    node.subVariableType = subVariableType;
  }

  /// ------ expressions

  /// binary expression.
  /// TODO: add more binary expression later
  /// TODO: instanceof, in, of
  visitBinaryExpr(node: BinaryExpressionNode) {
    this.visit(node.leftNode);
    this.visit(node.rightNode);

    const leftType = (node.leftNode as ValueNode).variableType;
    const op = node.operatorNode.type;
    const rightType = (node.rightNode as ValueNode).variableType;

    node.variableType = leftType;
    switch (leftType) {
      case 'string': {
        switch (op) {
          case '==':
          case '!=': {
            if (
              rightType != 'string' &&
              rightType != 'null' &&
              rightType != 'char'
            ) {
              this.addError(node, `'${op}' operator not allowed for strings`);
              break;
            }
            node.variableType = 'boolean';
            break;
          }
          case '+': {
            break;
          }
          default: {
            this.addError(node, `'${op}' operator not allowed for strings`);
            break;
          }
        }

        switch (rightType) {
          case 'int':
          case 'float':
          case 'bigint':
          case 'char':
          case 'string':
          case 'boolean':
          case 'null': {
            break;
          }
          default:
            this.addError(
              node.leftNode,
              `${leftType} ${op} ${rightType} not pemitted`
            );
        }
        break;
      }
      case 'int':
      case 'float':
      // @ts-ignore
      case 'bigint': {
        switch (rightType) {
          case 'int':
          case 'float':
          case 'bigint': {
            if (isComparisionOperator(op)) {
              node.variableType = 'boolean';
            }
            break;
          }
          default: {
            this.addError(
              node.rightNode,
              `'${op}' not allowed between ${leftType} & ${rightType}`
            );
          }
        }
        break;
      }
      case 'char': {
        if (isComparisionOperator(op)) {
          node.variableType = 'boolean';
        }
        if (!(rightType == 'char' || rightType == 'int')) {
          this.addError(
            node.rightNode,
            `'${op}' not allowed between ${leftType} & ${rightType}`
          );
        }
        break;
      }
      default: {
        this.addError(node, `Not possible to operator on the two operands`);
      }
    }
  }

  /// unary expression
  visitUnaryExpr(node: UnaryExpressionNode) {
    const opType = node.operatorNode.type;
    const expr = node.argumentNode;
    this.visit(expr);
    const varType = (expr as ValueNode).variableType;

    switch (opType) {
      case '!': {
        if (varType != 'boolean') {
          this.addError(node, `operation '${opType}' or ${varType}!`);
        } else {
          node.variableType = 'boolean';
        }
        break;
      }
      case '~':
      case '-':
      case '+': {
        switch (varType) {
          case 'int':
          case 'float':
          case 'bigint':
          case 'boolean':
            break;
          default: {
            this.addError(node, `operation '${opType}' or ${varType}!`);
            break;
          }
        }
        break;
      }
      case 'delete':
      case 'void': {
        node.variableType = 'void';
        break;
      }
      case 'typeof': {
        // TODO: handle this to be a type node
        break;
      }
      default: {
        break;
      }
    }
  }

  visitParenExpr(node: ParenthesizedExpressionNode) {
    this.visit(node.firstNamedChild!);
    node.variableType = (node.firstNamedChild as ValueNode)?.variableType!;
  }

  visitAssignmentExpr(node: AssignmentExpressionNode) {
    const left = node.leftNode as ValueNode;
    const right: ValueNode = node.rightNode as ValueNode;
    this.visit(left);
    this.visit(right);

    if (
      !compareVariableTypes(
        left.variableType,
        left.subVariableType,
        right.variableType,
        right.subVariableType
      )
    ) {
      this.addError(
        node,
        `Cannot assign variable of type "${
          (left as ValueNode).variableType
        }" to "${(right as ValueNode).variableType}"`
      );
    } else {
      node.variableType = (left as ValueNode).variableType;
    }
  }

  visitSeqExpr(node: SequenceExpressionNode) {
    this.visit(node.leftNode);
    this.visit(node.rightNode);
    if (node.rightNode.variableType != null)
      node.variableType = node.rightNode.variableType;
  }

  /// Add cases for objects as well
  visitSubscriptExpr(node: SubscriptExpressionNode) {
    const obj = node.objectNode;
    const index = node.indexNode;
    this.visit(obj);
    this.visit(index);
    switch (index.variableType) {
      case 'int': {
        if (obj.variableType != 'array' && obj.variableType != 'string') {
          this.addError(
            obj,
            `Cannot access ${index.text} of type ${obj.variableType}`
          );
        }
        break;
      }
      case 'string': {
        // TODO: For objects
        break;
      }
      default:
    }
  }

  visitMemberExpr(node: MemberExpressionNode) {
    const { objectNode, propertyNode } = node;
    this.visit(objectNode);
    if (objectNode.subVariableType != null) {
      const idType = objectNode.subVariableType?.fields![propertyNode.text];
      if (idType != null) {
        if (typeof idType == 'string') node.variableType = idType;
        else node.subVariableType = idType;
      } else {
        this.addError(objectNode, 'Undefined call');
      }
    }
  }

  // ----- declarations
  // Types of errors here
  // 1. - [x] Check if the given environment has the variable.
  // 2. - [x] Can't infer the type
  // 3. - [~] Not initializing a non-null variable
  // 4. - [~] Check if the given type is non-nullable or not first
  // 5. - [x] Allocating variable being declared.
  // 6. - [ ] object/array allocation.
  // 7. - [ ] functions
  // 8. - [ ] class instance
  visitLexicalDecl(node: LexicalDeclarationNode) {
    const isConst = node.child(0)?.type == 'const';
    node.isConst = isConst;
    for (const { child } of loopNamedNodeChild(node)) {
      (child as VariableDeclaratorNode).isConst = isConst;
      this.visitVariableDeclarator(child as VariableDeclaratorNode);
    }
  }

  visitVariableDeclarator(node: VariableDeclaratorNode) {
    const isConst = node.isConst ? true : false;
    let variableType = '';
    let subVariableType: SubVariableType | null = null;

    const childCount = node.namedChildCount;

    if (node.namedChildCount > 1) {
      // eslint-disable-next-line prefer-const
      let { nameNode, typeNode, valueNode } = node;

      if (childCount == 2) {
        if (typeNode != null) {
          // Nullable types: `let a: string | null`
          if (typeNode.firstNamedChild?.type != 'union_type') {
            // Non-nullable types without initializer: let a: string
            this.addError(node, 'Non-nullable types need a initializer');
          } else {
            this.visitTypeAnnotation(typeNode);
          }
        } else if (valueNode != null) {
          // Initializer included: let a = 1; let b = a; let c = "string";
          if (valueNode?.type == 'identifier') {
            // let a = b;
            this.visitIdentifier(valueNode as IdentifierNode);
            variableType = valueNode?.variableType;
            subVariableType = valueNode?.subVariableType ?? null;
          } else {
            this.visit(valueNode!);
            variableType = valueNode?.variableType!;
            if (valueNode?.subVariableType)
              subVariableType = valueNode?.subVariableType;
          }
        }
      } else if (childCount == 3) {
        this.visit(valueNode!);
        this.visitTypeAnnotation(typeNode!);
        if (
          compareVariableTypes(
            valueNode?.variableType!,
            valueNode?.subVariableType!,
            typeNode?.variableType!,
            typeNode?.subVariableType!
          )
        ) {
          variableType = valueNode?.variableType!;
          subVariableType = valueNode?.subVariableType!;
        } else
          this.addError(node, "Type Annotation and initiliazer don't match.");
      }

      nameNode = nameNode as IdentifierNode;
      nameNode.isConst = isConst;
      nameNode.variableType = variableType;
      nameNode.subVariableType = subVariableType!;

      this.addIdentifierToEnv(nameNode, IVarKind.variable);

      if (variableType == 'string') this.addDestructor(nameNode);

      node.variableType = variableType;
      node.subVariableType = subVariableType!;
    } else {
      this.addError(node, `Can't infer Type.`);
    }
  }

  // Resolves the type annotation node
  visitTypeAnnotation(node: TypeAnnotationNode) {
    const mainType = node.firstNamedChild!;
    switch (mainType?.type) {
      case 'predefined_type': {
        switch (mainType?.text) {
          case 'int':
          case 'float':
          case 'boolean':
          case 'string':
          case 'char': {
            node.variableType = mainType.text;
            break;
          }
          default:
            break;
        }
        break;
      }
      case 'array_type': {
        node.variableType = 'array';
        const fieldType = node.firstNamedChild?.firstNamedChild;
        switch (fieldType?.type) {
          case 'predefined_type': {
            node.subVariableType = {
              subTypes: [fieldType.text!],
              variableType: 'array',
            };
            break;
          }
          case 'array_type': {
            this.visitTypeAnnotation(
              (mainType as SyntaxNode) as TypeAnnotationNode
            );
            node.subVariableType = {
              subTypes: [],
              variableType: 'array',
            };
            node.subVariableType.subTypes?.push(mainType?.subVariableType!);
            break;
          }
          case 'union_type': {
            break;
          }
          default: {
            break;
          }
        }
        break;
      }
      case 'object_type': {
        node.variableType = 'object';
        const subVariableType: SubVariableType = {
          subTypes: [],
          variableType: 'object',
          fields: {},
        };
        for (const { child: pair } of loopNamedNodeChild(mainType)) {
          const valueNode = pair.lastNamedChild as ValueNode;
          const keyNode = pair.firstNamedChild as ValueNode;
          this.visit(valueNode);
          if (valueNode.subVariableType) {
            subVariableType.fields![keyNode.text] = valueNode.subVariableType!;
          } else {
            subVariableType.fields![keyNode.text] = valueNode.variableType;
          }
        }
        node.subVariableType = subVariableType;
        console.log('------>', JSON.stringify(subVariableType));
        break;
      }
      case 'type_identifier': {
        break;
      }
      default: {
        console.log(':794:', 'Unknown type..', mainType.toString());
      }
    }
  }

  // --------- utils ----------
  addIdentifierToEnv(node: IdentifierNode, kind: IVarKind) {
    const varName = node.text;
    let parentNode = node?.parent!;
    while (
      !(
        parentNode?.type == 'statement_block' ||
        parentNode?.type == 'program' ||
        parentNode?.type == 'for_statement'
      )
    )
      parentNode = parentNode?.parent!;

    const theEnv = (parentNode as StatementBlockNode).env;

    if (theEnv[varName] == null) theEnv[varName] = { ...node, kind };
    else this.addError(node, 'redeclaring variable!');
  }

  addDestructor(node: IdentifierNode) {
    this.currentScope.destructors[node.text] = node.variableType;
  }

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

  // TODO: Reduce complex types
  reduceComplexType(node: SyntaxNode): string {
    return node.text;
  }
}
