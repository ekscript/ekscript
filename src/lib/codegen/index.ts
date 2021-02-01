import { SyntaxNode, Tree } from 'tree-sitter-ekscript';
import { TCompilerError, Visitor } from 'types/compiler';

import {
  detectTypeFromVariableDecl,
  matchLiteralType,
} from '../../utils/codegenResolverUtils';
import { loopNamedNodeChild, loopNodeChildren } from '../../utils/iterators';
import { TCompilerErrorType } from '../compiler/errorHandler';

import { genMain } from './constantFunctions';
import { genStringConcatUtil } from './utils/stringUtils';
// import { genStringUtil } from './utils/utils1';
// --------------------------------------------

class CodeGen implements Visitor<void, SyntaxNode> {
  private includes: string[] = [];
  private utils: string[] = [];
  private generalCode: string[] = [];

  private currentNode: SyntaxNode | null = null;

  // only named as 'stdbool', 'string' etc
  private alreadyImportedHeaders: Set<string> = new Set<string>();
  private alreadyImportedStringConcatUtilFunc: Set<string> = new Set<string>();

  private _singleLineStart = false;
  private singleLine: string[] = [];
  private indentLevel = 0;

  private currentFunc: string | null = null;
  private funcCode: string[] = [];
  private destructors: string[] = [];
  private numTempVars = 0;

  constructor(
    private ast: Tree,
    private errors: TCompilerError[] = [],
    private warnings: TCompilerError[] = []
  ) {}

  get singleLineStart() {
    return this._singleLineStart;
  }
  set singleLineStart(v: boolean) {
    this._singleLineStart = v;
    if (!v) this.singleLine = [];
  }

  printAst() {
    console.log(this.ast.rootNode.toString());
  }

  compileToC(ast?: Tree): string {
    if (ast) this.ast = ast;
    this.visit(this.ast.rootNode);
    return this.getFinalCode();
  }

  getFinalCode = () =>
    [...this.includes, ...this.utils, ...this.generalCode].join('\n');

  addLine(line: string) {
    this.currentFunc != null
      ? this.funcCode.push(line)
      : this.generalCode.push(line);
  }

  addInclude = (lib: string) => {
    if (!this.alreadyImportedHeaders.has(lib)) {
      this.includes.push(`#include<${lib}.h>`);
      this.alreadyImportedHeaders.add(lib);
    }
  };

  addUtils = (line: string) => this.utils.push(line);

  addError(errorMessage: string) {
    this.errors.push({
      line: this.currentNode?.startPosition.row ?? 0,
      pos: this.currentNode?.startPosition.column ?? 0,
      errorMessage,
      errorType: TCompilerErrorType.COMPILE_ERROR,
    });
  }

  addWarning(errorMessage: string) {
    this.warnings.push({
      line: this.currentNode?.startPosition.row ?? 0,
      pos: this.currentNode?.startPosition.column ?? 0,
      errorMessage,
      errorType: TCompilerErrorType.COMPILE_ERROR,
    });
  }

  addCol(col: string) {
    this.singleLineStart
      ? this.singleLine.push(col)
      : this.generalCode.push(col);
  }

  getIndentation() {
    let indentStr = '';
    for (let i = 0; i < this.indentLevel; i++) indentStr += '  ';
    return indentStr;
  }

  addStmt() {
    this.addCol(';');
    this.addLine(this.getIndentation() + this.singleLine.join(' '));
  }

  // ----------- all the visitors ---------
  visit(node: SyntaxNode) {
    switch (node?.type) {
      case 'program': {
        this.visitProgram(node);
        break;
      }
      case 'comment': {
        break;
      }
      case 'expression_statement':
        this.visitExprStmt(node);
        break;
      case 'binary_expression':
        this.visitBinaryExpr(node);
        break;
      case ';':
        break;
      case 'int_literal': {
        this.visitInt(node);
        break;
      }
      case 'float_literal': {
        this.visitFloat(node);
        break;
      }
      case 'char': {
        this.visitChar(node);
        break;
      }
      case 'parenthesized_expression': {
        this.visitParenExpr(node);
        break;
      }
      case 'unary_expression': {
        this.visitUnaryExpr(node);
        break;
      }
      case 'identifier': {
        this.visitIdentifier(node);
        break;
      }
      case 'false':
      case 'true': {
        this.visitBoolean(node);
        break;
      }
      case 'string': {
        this.visitString(node);
        break;
      }
      case 'lexical_declaration': {
        this.visitLexicalDecl(node);
        break;
      }
      default: {
        console.log('node: ', node, '; node.type: ', node?.type);
        console.log(node?.toString());
        throw new Error('Error compiling some weird shit!');
      }
    }
  }

  visitProgram(node: SyntaxNode) {
    if (node.childCount == 0) {
      this.addLine('int main() { return 0; }\n');
      return;
    }
    this.currentFunc = 'main';
    this.indentLevel++;

    for (const { child } of loopNodeChildren(node)) this.visit(child);

    this.funcCode.push(...this.destructors);
    this.generalCode.push(genMain(this.funcCode));

    this.indentLevel--;

    this.destructors = [];
    this.currentFunc = null;
  }

  // ------ Statements Visitor --------
  visitExprStmt(node: SyntaxNode) {
    this.singleLineStart = true;

    for (const { child } of loopNodeChildren(node)) this.visit(child);

    this.addStmt();

    this.singleLineStart = false;
    this.singleLine = [];
  }

  // ------ Declarations -----------
  // TODO: identifier type through the syntaxnode.
  // cases: let i; let i: string; let i = 'hello'; let i: string = 'hello';
  // let i: string = 'hello', i: int = 1
  visitLexicalDecl(node: SyntaxNode) {
    const letOrConst = node.child(0)?.type!;

    for (const { child } of loopNamedNodeChild(node)) {
      if (child.namedChildCount > 1) {
        this.singleLineStart = true;

        if (letOrConst == 'const') this.addCol(letOrConst);

        // for the type
        const childType = detectTypeFromVariableDecl(child);
        if (childType == 'bool') this.addInclude('stdbool');
        this.addCol(childType);

        // for the identifier
        this.visit(child.firstNamedChild!);

        // for initializer
        const lastChild = child.lastNamedChild!;
        if (
          matchLiteralType(lastChild.type) ||
          lastChild.type == 'identifier' ||
          lastChild.type == 'parenthesized_expression'
        ) {
          this.addCol('=');

          if (lastChild.type == 'string') {
            this.addCol('initString(');
            this.visit(lastChild);
            this.addCol(`, ${lastChild.text.length - 2}`);
            this.addCol(')');
          } else {
            this.visit(lastChild);
          }
        }

        this.addStmt();
        this.singleLineStart = false;
      }
    }
  }

  // ------ Expression visitor -------

  visitBinaryExpr(node: SyntaxNode) {
    const left = node?.child(0)!;
    const operator = node?.child(1)!;
    const right = node?.child(2)!;

    if (left?.type == 'string') {
      let rightType: string = right?.type!;
      switch (rightType) {
        case 'int_literal':
        // @ts-ignore
        case 'float_literal': {
          rightType = rightType.slice(0, rightType.length - 8);
        }
        case 'true':
        case 'false':
        case 'null':
        case 'char':
        case 'string': {
          let rightText = right?.text!;
          const leftText = left.text.slice(1, left.text.length - 1);
          if (rightType == 'string' || rightType == 'char')
            rightText = rightText.slice(1, rightText.length - 1);
          this.addCol(`"${leftText}${rightText}"`);
          break;
        }
        case 'parenthesized_expression':
        case 'identifier': {
          // TODO: this will be updated based on the type of the variable
          // from the resolver
          const identifierType = 'int';

          if (!this.alreadyImportedStringConcatUtilFunc.has(identifierType)) {
            this.addUtils(genStringConcatUtil(identifierType));
            this.alreadyImportedStringConcatUtilFunc.add(identifierType);
          }

          const tempVar = 'temp_' + ++this.numTempVars;

          this.addLine(
            `${this.getIndentation()}const char* ${tempVar} = concat_string_lit_${identifierType}( ${
              left.text
            }, ${left.text.length - 2}, ${right?.text});`
          );
          this.addCol(tempVar);
          this.destructors.push(`${this.getIndentation()}free(${tempVar});`);
          break;
        }
        default:
      }
    } else {
      this.visit(left);
      this.visitBinaryOperator(operator);
      this.visit(right);
    }
  }

  visitParenExpr(node: SyntaxNode) {
    this.addCol('(');
    const childCount = node?.childCount!;
    for (const { child, i } of loopNodeChildren(node)) {
      if (i != childCount - 1 && i != 0) this.visit(child);
    }
    this.addCol(')');
  }

  visitUnaryExpr(node: SyntaxNode) {
    this.addCol(node?.child(0)?.text!);
    this.addCol(node?.child(1)?.text!);
  }

  visitBinaryOperator(node: SyntaxNode) {
    this.addCol(node?.text!); // operator
  }

  // ----- literal and identifier -----
  visitChar(node: SyntaxNode) {
    this.addCol(node?.text!);
  }

  visitInt(node: SyntaxNode) {
    this.addCol(node?.text!);
  }

  visitFloat(node: SyntaxNode) {
    this.addCol(node?.text!);
  }

  visitBoolean(node: SyntaxNode) {
    this.addInclude('stdbool');
    this.addCol(node?.text!);
  }

  visitString(node: SyntaxNode) {
    this.addCol(node?.text!);
  }

  visitIdentifier(node: SyntaxNode) {
    this.addCol(node?.text!);
  }
}

export default CodeGen;
