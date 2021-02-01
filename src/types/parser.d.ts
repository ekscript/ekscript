import { char, float, int } from '../global.d';
import { EkTokenType, ExprKind, StatementKind } from '../lib/parser/token';

export type Literal = null | int | char | string | float | bigint | boolean;

export type Token = {
  literal: Literal;
  line: int;
  posStart: int;
  lexeme: string;
  tokenType: EkTokenType;
};

export type AstNode = {
  child?: AstNode | null;
  parent?: AstNode | null;
};

// --------------- ExprVal ------------------
export type TernaryExprVal = [
  condition: Expr,
  first: Expr,
  second: Expr,
  token: Token
];
export type BinaryExprVal = [first: Expr, operator: Token, second: Expr];
export type GroupingExprVal = Expr;
export type LiteralExprVal = Literal;
export type UnaryExprVal = [operator: Token, expr: Expr];
export type AssignExprVal = [name: Token, value: Expr];
export type VarExprVal = Token;
export type NilExprVal = int;
export type LogicalExprVal = [first: Expr, operator: Token, second: Expr];
export type CallExprVal = [callee: Expr, paren: Token, args: Expr[]];

export type ExprVal =
  | TernaryExprVal
  | BinaryExprVal
  | GroupingExprVal
  | LiteralExprVal
  | UnaryExprVal
  | AssignExprVal
  | VarExprVal
  | NilExprVal
  | LogicalExprVal
  | CallExprVal
  | PrimitiveTypeExprVal;

export type ObjExprVal = [];
export type PrimitiveTypeExprVal = Token; // int, float, char, string, null, boolean

// ------------- Expr ---------------
export type EkVisitCallbackType = () => void;
export interface Expr {
  kind: ExprKind;
  exprVal: ExprVal;
  visit: EkVisitCallbackType;
}
export interface TernaryExpr extends Expr {
  exprVal: TernaryExprVal;
}
export interface BinaryExpr extends Expr {
  exprVal: BinaryExprVal;
}
export interface GroupingExpr extends Expr {
  exprVal: GroupingExprVal;
}
export interface LiteralExpr extends Expr {
  exprVal: LiteralExprVal;
}
export interface UnaryExpr extends Expr {
  exprVal: UnaryExprVal;
}
export interface AssignExpr extends Expr {
  exprVal: AssignExprVal;
}
export interface VarExpr extends Expr {
  exprVal: VarExprVal;
}
export interface NilExpr extends Expr {
  exprVal: NilExprVal;
}
export interface LogicalExpr extends Expr {
  exprVal: LogicalExprVal;
}
export interface CallExpr extends Expr {
  exprVal: CallExprVal;
}
export interface PrimitiveTypeExpr extends Expr {
  exprVal: PrimitiveTypeExprVal;
}

// --------- Statements --------------
export type BlockStmtVal = Stmt[];
export type ExprStmtVal = Expr;
export type VarStmtVal = [
  name: Token,
  value: Expr,
  variableType: EkTokenType.CONST | EkTokenType.LET
];
export type IfStmtVal = [condition: Expr, thenBranch: Stmt, elseBranch: Stmt];
export type WhileStmtVal = [condition: Expr, body: Stmt];
export type FuncStmtVal = [name: Token, params: Token[], body: Stmt[]];
export type ReturnStmtVal = [keyword: Token, value: Expr];
export type TypeStmtVal = [];

export interface Stmt {
  kind: StatementKind;
  stmtVal:
    | BlockStmtVal
    | ExprStmtVal
    | VarStmtVal
    | TypeStmtVal
    | IfStmtVal
    | WhileStmtVal
    | FuncStmtVal
    | TypeStmtVal
    | ReturnStmtVal;
  visit: () => void;
}
export interface BlockStmt extends Stmt {
  stmtVal: BlockStmtVal;
}
export interface ExprStmt extends Stmt {
  stmtVal: ExprStmtVal;
}
export interface VarStmt extends Stmt {
  stmtVal: VarStmtVal;
}
export interface IfStmt extends Stmt {
  stmtVal: IfStmtVal;
}
export interface WhileStmt extends Stmt {
  stmtVal: WhileStmtVal;
}
export interface FuncStmt extends Stmt {
  stmtVal: FuncStmtVal;
}
export interface ReturnStmt extends Stmt {
  stmtVal: ReturnStmtVal;
}
export interface TypeStmt extends Stmt {
  stmtVal: TypeStmtVal;
}
