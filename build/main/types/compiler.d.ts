import { MemberExpressionNode, ObjectNode, PropertyIdentifierNode } from 'tree-sitter-ekscript';
import { int } from '../global';
import { TCompilerBackendType } from '../lib/compiler';
import { TCompilerErrorType } from '../lib/compiler/errorHandler';
export declare type TCompilerError = {
    line: int;
    pos: int;
    errorMessage: string;
    errorType: TCompilerErrorType;
};
export declare type TCompilerSource = {
    filePath: string;
    fileContent: string;
};
export declare type TCompilerConstrArgs = {
    entry: TCompilerSource;
    backend?: TCompilerBackendType;
    sources?: TCompilerSource[];
    outputFile?: string;
};
export interface Visitor<T, R = void> {
    visit(node: T): R;
    visitProgram(node: T): R;
    visitExprStmt(node: T, newLine?: boolean): R;
    visitIfStmt(node: T): R;
    visitWhileStmt(node: T): R;
    visitForStmt(node: T): R;
    visitStmtBlock(node: T): R;
    visitEmptyStmt(node: T): R;
    visitSwitchStmt(node: T): R;
    visitBreakStmt(node: T): R;
    visitVariableDeclarator(node: T): R;
    visitBoolean(node: T): R;
    visitInt(node: T): R;
    visitFloat(node: T): R;
    visitBigInt(node: T): R;
    visitChar(node: T): R;
    visitString(node: T): R;
    visitIdentifier(node: T): R;
    visitPropertyIdentifier(node: PropertyIdentifierNode): R;
    visitArray(node: T): R;
    visitObject(node: ObjectNode): R;
    visitTypeAnnotation(node: T): R;
    visitTypeAliasDeclaration(node: T): R;
    visitParenExpr(node: T): R;
    visitBinaryExpr(node: T): R;
    visitUnaryExpr(node: T): R;
    visitAssignmentExpr(node: T): R;
    visitSeqExpr(node: T): R;
    visitSubscriptExpr(node: T): R;
    visitMemberExpr(node: MemberExpressionNode): R;
    visitLexicalDecl(node: T): R;
}
export declare type FuncGenType = {
    name: string;
    returnType: string;
    funcArgs: [argType: string, argName: string][];
    body: string[];
    destructors: string[];
};
export declare enum IVarKind {
    variable = 0,
    typeDef = 1
}
