/**
 * ===================================================
 * Resolver is many things.
 * But first and foremost, it contains the type-checker
 * And the semantic analyzer
 * Further, visitors simplify each node, add Type Metadat
 * for code generator
 * ===================================================
 * */
import { ArrayNode, AssignmentExpressionNode, BigIntNode, BinaryExpressionNode, BreakStatementNode, CharNode, ElseClauseNode, EmptyStatementNode, ExpressionStatementNode, FalseNode, FloatNode, ForStatementNode, IdentifierNode, IfStatementNode, IntNode, LexicalDeclarationNode, MemberExpressionNode, ObjectNode, ObjectTypeNode, ParenthesizedExpressionNode, ProgramNode, PropertyIdentifierNode, ScopeContainer, SequenceExpressionNode, StatementBlockNode, StringNode, SubscriptExpressionNode, SubVariableType, SwitchStatementNode, SyntaxNode, Tree, TrueNode, TypeAliasDeclarationNode, TypeAnnotationNode, TypeIdentifierNode, UnaryExpressionNode, VariableDeclaratorNode, WhileStatementNode, IVarKind as IIVarKind } from 'tree-sitter-ekscript';
import { TCompilerError, Visitor } from 'types/compiler';
export default class Resolver implements Visitor<SyntaxNode, void> {
    private tree;
    private errors;
    private warnings;
    currentScope: ScopeContainer;
    _generators: Record<string, SubVariableType>;
    counter: number;
    constructor(tree: Tree, errors: TCompilerError[], warnings: TCompilerError[]);
    get generators(): Record<string, SubVariableType>;
    visit(node: SyntaxNode): this;
    visitEmptyStmt(node: EmptyStatementNode): void;
    visitProgram(node: ProgramNode): void;
    visitExprStmt(node: ExpressionStatementNode): void;
    visitIfStmt(node: IfStatementNode): void;
    visitElseClause(node: ElseClauseNode): void;
    visitStmtBlock(node: StatementBlockNode): void;
    visitWhileStmt(node: WhileStatementNode): void;
    visitForStmt(node: ForStatementNode): void;
    visitSwitchStmt(node: SwitchStatementNode): void;
    visitBreakStmt(node: BreakStatementNode): void;
    visitInt(node: IntNode): void;
    visitBoolean(node: TrueNode | FalseNode): void;
    visitFloat(node: FloatNode): void;
    visitBigInt(node: BigIntNode): void;
    visitChar(node: CharNode): void;
    visitString(node: StringNode): void;
    visitIdentifier(node: IdentifierNode): void;
    visitPropertyIdentifier(node: PropertyIdentifierNode): void;
    visitArray(node: ArrayNode, generator?: boolean): void;
    visitObject(node: ObjectNode, generator?: boolean): void;
    visitBinaryExpr(node: BinaryExpressionNode): void;
    visitUnaryExpr(node: UnaryExpressionNode): void;
    visitParenExpr(node: ParenthesizedExpressionNode): void;
    visitAssignmentExpr(node: AssignmentExpressionNode): void;
    visitSeqExpr(node: SequenceExpressionNode): void;
    visitSubscriptExpr(node: SubscriptExpressionNode): void;
    visitMemberExpr(node: MemberExpressionNode): void;
    visitLexicalDecl(node: LexicalDeclarationNode): void;
    visitVariableDeclarator(node: VariableDeclaratorNode): void;
    visitTypeAnnotation(node: TypeAnnotationNode, generator?: boolean): void;
    visitObjectType(node: ObjectTypeNode): void;
    visitTypeAliasDeclaration(node: TypeAliasDeclarationNode): void;
    addIdentifierToEnv(node: IdentifierNode | TypeIdentifierNode, kind: IIVarKind): void;
    addError(node: SyntaxNode, errorMessage: string): void;
    addWarning(node: SyntaxNode, errorMessage: string): void;
    reduceComplexType(node: SyntaxNode): string;
}
