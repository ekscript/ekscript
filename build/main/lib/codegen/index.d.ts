/**
* ===================================
* C Generator backend for EkScript
* ---
* This is the C Generator Backend for EkScript
* ===================================
* */
import { ArrayNode, AssignmentExpressionNode, BigIntNode, BinaryExpressionNode, BooleanNode, CharNode, ElseClauseNode, EmptyStatementNode, ExpressionStatementNode, FloatNode, ForStatementNode, IdentifierNode, IfStatementNode, IntNode, LexicalDeclarationNode, MemberExpressionNode, ObjectNode, ParenthesizedExpressionNode, ProgramNode, PropertyIdentifierNode, ScopeContainer, SequenceExpressionNode, StatementBlockNode, StringNode, SubscriptExpressionNode, SubVariableType, SwitchStatementNode, SyntaxNode, Tree, TypeAnnotationNode, TypeAliasDeclarationNode, UnaryExpressionNode, VariableDeclaratorNode, WhileStatementNode } from 'tree-sitter-ekscript';
import { FuncGenType, TCompilerError, Visitor } from 'types/compiler';
declare class CodeGen implements Visitor<SyntaxNode> {
    private ast;
    private errors;
    private warnings;
    private generators;
    private utils;
    private includes;
    private alreadyImportedIncludes;
    private _singleLineStart;
    private currLine;
    private indentLevel;
    private functions;
    currentFunc: FuncGenType;
    numTempVars: number;
    currentScope: ScopeContainer;
    private specialFlag;
    private specialLine;
    constructor(ast: Tree, errors?: TCompilerError[], warnings?: TCompilerError[], generators?: Record<string, SubVariableType>);
    get singleLineStart(): boolean;
    set singleLineStart(v: boolean);
    printAst(): void;
    compileToC(ast?: Tree): string;
    getFinalCode: () => string;
    addLine(): void;
    addCol(col: string): void;
    addInclude: (lib: string) => void;
    addUtils: (line: string) => number;
    addError(node: SyntaxNode, errorMessage: string): void;
    addWarning(node: SyntaxNode, errorMessage: string): void;
    get indent(): string;
    visit(node: SyntaxNode): void;
    visitProgram(node: ProgramNode): void;
    visitExprStmt(node: ExpressionStatementNode, nextLine?: boolean): void;
    visitIfStmt(node: IfStatementNode): void;
    visitElseClause(node: ElseClauseNode): void;
    visitWhileStmt(node: WhileStatementNode): void;
    visitForStmt(node: ForStatementNode): void;
    visitEmptyStmt(_node: EmptyStatementNode, newLine?: boolean): void;
    visitStmtBlock(node: StatementBlockNode): void;
    visitSwitchStmt(node: SwitchStatementNode): void;
    visitBreakStmt(): void;
    visitLexicalDecl(node: LexicalDeclarationNode): void;
    visitVariableDeclarator(node: VariableDeclaratorNode): void;
    visitTypeAnnotation(node: TypeAnnotationNode): void;
    visitTypeAliasDeclaration(node: TypeAliasDeclarationNode): void;
    visitAssignmentExpr(node: AssignmentExpressionNode): void;
    visitBinaryExpr(node: BinaryExpressionNode): void;
    visitParenExpr(node: ParenthesizedExpressionNode): void;
    visitUnaryExpr(node: UnaryExpressionNode): void;
    visitSeqExpr(node: SequenceExpressionNode): void;
    visitSubscriptExpr(node: SubscriptExpressionNode): void;
    visitMemberExpr(node: MemberExpressionNode): void;
    visitPropertyIdentifier(node: PropertyIdentifierNode): void;
    visitArray(node: ArrayNode): void;
    visitObject(node: ObjectNode): void;
    visitChar(node: CharNode): void;
    visitInt(node: IntNode): void;
    visitBigInt(node: BigIntNode): void;
    visitFloat(node: FloatNode): void;
    visitBoolean(node: BooleanNode): void;
    addString(str: string, varName: string): void;
    addToCurrentFunc(str: string): void;
    visitString(node: StringNode): void;
    visitIdentifier(node: IdentifierNode): void;
    addDestructors(node: ScopeContainer): void;
}
export default CodeGen;
