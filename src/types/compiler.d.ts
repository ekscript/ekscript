import { int } from '../global';
import { TCompilerBackendType } from '../lib/compiler';
import { TCompilerErrorType } from '../lib/compiler/errorHandler';

export type TCompilerError = {
  line: int;
  pos: int;
  errorMessage: string;
  errorType: TCompilerErrorType;
};

export type TCompilerSource = {
  filePath: string;
  fileContent: string;
};

export type TCompilerConstrArgs = {
  entry: TCompilerSource;
  backend?: TCompilerBackendType;
  sources?: TCompilerSource[];
  outputFile?: string;
};

export interface Visitor<T, R = void> {
  visit(node: R): T;
  visitProgram(node: R): T;

  // statements
  visitExprStmt(node: R): T;
  visitBinaryExpr(node: R): T;
  visitUnaryExpr(node: R): T;

  // identifiers and literals
  visitBoolean(node: R): T;
  visitInt(node: R): T;
  visitFloat(node: R): T;
  visitChar(node: R): T;
  visitString(node: R): T;

  // expressions
  visitParenExpr(node: R): T;
  visitIdentifier(node: R): T;

  // declarations
  visitLexicalDecl(node: R): T;
}
