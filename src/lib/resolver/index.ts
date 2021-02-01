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
  IdentifierNode,
  IVarKind,
  LexicalDeclarationNode,
  ProgramNode,
  StatementBlockNode,
  SyntaxNode,
  Tree,
  VariableDeclaratorNode,
} from 'tree-sitter-ekscript';
import { TCompilerError, Visitor } from 'types/compiler';

import {
  detectTypeFromVariableDecl,
  getEnvValueRecursively,
} from '../../utils/codegenResolverUtils';
import { VarKind } from '../../utils/defaultValues';
import { loopNamedNodeChild, loopNodeChildren } from '../../utils/iterators';
import { TCompilerErrorType } from '../compiler/errorHandler';

// -------------------
export default class Resolver implements Visitor<void> {
  // implements Visitor<Tree | null>
  private currNode: SyntaxNode | null;

  constructor(
    private tree: Tree,
    private errors: TCompilerError[],
    private warnings: TCompilerError[]
  ) {
    this.currNode = tree?.rootNode ?? null;
    (this.currNode! as ProgramNode).env = {};
  }

  // --------- visit --------------
  visit() {
    for (const { child: node } of loopNodeChildren(this.currNode)) {
      this.currNode = node;
      switch (node.type) {
        case 'program': {
          this.visitProgram();
          break;
        }
        case 'comment': {
          break;
        }
        case 'expression_statement':
          this.visitExprStmt();
          break;
        case 'binary_expression':
          this.visitBinaryExpr();
          break;
        case ';':
          break;
        case 'int_literal': {
          this.visitInt();
          break;
        }
        case 'float_literal': {
          this.visitFloat();
          break;
        }
        case 'char': {
          this.visitChar();
          break;
        }
        case 'parenthesized_expression': {
          this.visitParenExpr();
          break;
        }
        case 'unary_expression': {
          this.visitUnaryExpr();
          break;
        }
        case 'identifier': {
          this.visitIdentifier();
          break;
        }
        case 'false':
        case 'true': {
          this.visitBoolean();
          break;
        }
        case 'string': {
          this.visitString();
          break;
        }
        case 'lexical_declaration': {
          this.visitLexicalDecl();
          break;
        }
        default: {
          throw new Error('Error compiling some weird shit!');
        }
      }
    }
  }

  visitProgram() {
    return null;
  }

  // ---- statements
  visitExprStmt() {
    for (const { child } of loopNodeChildren(this.currNode)) {
      child;
      this.visit();
    }
  }

  //  ---- identifiers & literals
  visitInt() {
    // TODO: replace _ in numbers 1_1 becomes 11
  }

  visitBoolean() {
    // continue
  }

  visitFloat() {
    // TODO: replace _ in numbers 1.1_0 becomes 1.10
  }

  visitChar() {
    // continue
  }

  visitString() {
    // modify multilined strings to single lined
  }

  visitIdentifier() {
    const identifier = this.currNode as IdentifierNode;
    const identifierInEnv = getEnvValueRecursively(
      identifier.text,
      this.currNode!
    );
    if (identifierInEnv == null) this.addError('Undefined variable');
    else {
      identifier.variableType = identifierInEnv.type;
      identifier.isConst = identifierInEnv.isConst;
    }
  }

  // ------ expressions
  // - [ ] handle more binary expressions
  visitBinaryExpr() {
    const left = this.currNode?.child(0)!;
    const operator = this.currNode?.child(1)!;
    const right = this.currNode?.child(2)!;

    if (left.type != right.type) {
      if (left.type == 'string') {
        if (right.type == 'identifier') {
          const rightId = right as IdentifierNode;
          if (!rightId.type) this.addError('Undeclared identifier');
        }
      } else if (left.type == 'int_literal' || left.type == 'float_literal') {
        if (
          right.type == 'string' ||
          right.type == 'true' ||
          right.type == 'false' ||
          right.type == 'null'
        ) {
          const leftt = left.type.slice(0, left.type.length - 8);
          this.addError(`${leftt} ${operator.type} ${right.type} not pemitted`);
        }
      }
    } else {
      if (left.type == 'string' || right.type == 'string') {
        if (operator.type != '+')
          this.addError(`Cannot operate ${operator.text} on two strings.`);
      }
      if (left.type == 'identifier' || right.type == 'identifier') {
        const tempNode = this.currNode;
        this.currNode = left;
        this.visitIdentifier();
        this.currNode = right;
        this.visitIdentifier();
        this.currNode = tempNode;
        if (
          (left as IdentifierNode).variableType !=
          (right as IdentifierNode).variableType
        )
          this.addError(`Cannot operate between ${left} ${operator} ${right}`);
      }
    }
  }

  visitUnaryExpr() {
    console.log(this.currNode?.toString());
    // TODO
  }

  visitParenExpr() {
    console.log(this.currNode?.toString());
    // TODO: continue
  }

  // ----- declarations
  // Types of errors here
  // 1. - [x] Check if the given environment has the variable.
  // 2. - [x] Can't infer the type
  // 3. - [~] Not initializing a non-null variable
  // 4. - [~] Check if the given type is non-nullable or not first
  // 5. - [x] Allocating variable being declared.
  // 6. - [ ] object/array allocation.
  visitLexicalDecl() {
    const node = (this.currNode as LexicalDeclarationNode)!;
    const isConst = node?.child(0)?.type == 'const';

    for (const { child: variableDecl } of loopNamedNodeChild(node)) {
      if (variableDecl.namedChildCount > 1) {
        const identifier = variableDecl?.firstNamedChild as IdentifierNode;
        try {
          const variableType = detectTypeFromVariableDecl(
            variableDecl as VariableDeclaratorNode
          );

          this.addIdentifierToEnv(
            identifier.text,
            variableType,
            VarKind.variable,
            isConst
          );

          identifier.isConst = isConst;
          identifier.variableType = variableType;
        } catch (e) {
          this.addError(e.message);
        }
      } else {
        this.addError(
          `Can't infer Type. Either specify the type or initialize the variable`
        );
      }
    }
  }

  // --------- utils ----------

  addIdentifierToEnv(
    varName: string,
    variableType: string,
    kind: VarKind | IVarKind,
    isConst: boolean
  ) {
    let parentNode = this.currNode?.parent!;
    while (
      !(parentNode?.type == 'statement_block' || parentNode?.type == 'program')
    ) {
      parentNode = parentNode?.parent!;
    }
    (parentNode as StatementBlockNode).env[varName] = {
      type: variableType,
      kind: kind as IVarKind,
      isConst,
    };
  }

  editAst() {
    console.log(this.tree);
  }

  addError(errorMessage: string) {
    this.errors.push({
      line: this.currNode?.startPosition.row ?? 0,
      pos: this.currNode?.startPosition.column ?? 0,
      errorMessage,
      errorType: TCompilerErrorType.COMPILE_ERROR,
    });
  }

  addWarning(errorMessage: string) {
    this.warnings.push({
      line: this.currNode?.startPosition.row ?? 0,
      pos: this.currNode?.startPosition.column ?? 0,
      errorMessage,
      errorType: TCompilerErrorType.COMPILE_ERROR,
    });
  }
}
