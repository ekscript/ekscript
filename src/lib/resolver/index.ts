/**
 * ===================================================
 * Resolver is many things.
 * But first and foremost, it contains the type-checker
 * And the semantic analyzer
 * Further, visitors simplify each node, add Type Metadat
 * for code generator
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
    ElseClauseNode,
    EmptyStatementNode,
    ExpressionStatementNode,
    FalseNode,
    FloatNode,
    ForStatementNode,
    IdentifierNode,
    IfStatementNode,
    IntNode,
    LexicalDeclarationNode,
    MemberExpressionNode,
    ObjectNode,
    ObjectTypeNode,
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
    TypeAliasDeclarationNode,
    TypeAnnotationNode,
    TypeIdentifierNode,
    UnaryExpressionNode,
    ValueNode,
    VariableDeclaratorNode,
    WhileStatementNode,
    IVarKind as IIVarKind,
} from 'tree-sitter-ekscript';
import { TCompilerError, Visitor } from 'types/compiler';

import {
    compareVariableTypes,
    getEnvValueRecursively,
} from '../utils/codegenResolverUtils';
import { loopNamedNodeChild } from '../utils/iterators';
import { TCompilerErrorType } from '../compiler/errorHandler';

import {
    visitTypeAnnotation,
    visitTypeAliasDeclaration,
    visitObjectType,
} from './typeResolver';
import { visitArray, visitObject } from './arrayObjectResolver';
import { visitVariableDeclarator } from './variableDeclResolver';
import { visitBinaryExpr, visitUnaryExpr } from './exprResolver';

import { logFactory } from '../utils/fileOps';

// -------------------
// @ts-ignore
global.logFactory = logFactory;

export default class Resolver implements Visitor<SyntaxNode, void> {
    currentScope: ScopeContainer;
    _generators: Map<string, SubVariableType> = new Map();
    counter = 0;

    constructor(
        private tree: Tree,
        private errors: TCompilerError[],
        private warnings: TCompilerError[]
    ) {
        this.currentScope = this.tree.rootNode as ProgramNode;
    }

    get generators(): Map<string, SubVariableType> {
        return this._generators;
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
            case 'type_identifier':
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
            case 'type_alias_declaration': {
                this.visitTypeAliasDeclaration(node as TypeAliasDeclarationNode);
                break;
            }
            default: {
                console.log('-->', node.toString());
                throw new Error('Error compiling some weird shit!');
            }
        }
        return this;
    }

    visitEmptyStmt(node: EmptyStatementNode) {
        node;
    }

    visitProgram(node: ProgramNode) {
        node.destructors = {};
        node.env = {};
        this.currentScope = node;
        for (const { child } of loopNamedNodeChild(node)) this.visit(child);
    }

    // ---------- statements --------
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
                    this.visitElseClause(child as ElseClauseNode);
                    break;
                default:
            }
        }
    }

    visitElseClause(node: ElseClauseNode) {
        node.destructors = {};
        node.env = {};
        this.currentScope = node;
        if (node.firstNamedChild) this.visit(node.firstNamedChild);
    }

    visitStmtBlock(node: StatementBlockNode) {
        node.destructors = {};
        node.env = {};
        for (const { child } of loopNamedNodeChild(node)) {
            this.currentScope = node;
            this.visit(child);
        }
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

    //  -------- identifiers & literals ----------
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

    visitArray(node: ArrayNode, generator = false) {
        visitArray(this, node, generator);
    }

    visitObject(node: ObjectNode, generator = false) {
        visitObject(this, node, generator);
    }

    // ------ expressions ---------

    visitBinaryExpr(node: BinaryExpressionNode) {
        visitBinaryExpr(this, node);
    }

    visitUnaryExpr(node: UnaryExpressionNode) {
        visitUnaryExpr(this, node);
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
                `Cannot assign variable of type "${(left as ValueNode).variableType
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
                // TODO: For objects use this to
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
    visitLexicalDecl(node: LexicalDeclarationNode) {
        const isConst = node.child(0)?.type == 'const';
        node.isConst = isConst;
        for (const { child } of loopNamedNodeChild(node)) {
            (child as VariableDeclaratorNode).isConst = isConst;
            this.visitVariableDeclarator(child as VariableDeclaratorNode);
        }
    }

    visitVariableDeclarator(node: VariableDeclaratorNode) {
        visitVariableDeclarator(this, node);
    }

    visitTypeAnnotation(node: TypeAnnotationNode, generator = false) {
        visitTypeAnnotation(this, node, generator);
    }

    // --------- TypeAlias ------
    visitObjectType(node: ObjectTypeNode) {
        visitObjectType(this, node);
    }

    visitTypeAliasDeclaration(node: TypeAliasDeclarationNode) {
        visitTypeAliasDeclaration(this, node);
    }

    // --------- utils ----------
    addIdentifierToEnv(
        node: IdentifierNode | TypeIdentifierNode,
        kind: IIVarKind
    ) {
        const varName = node.text;
        let parentNode = node?.parent;
        while (
            !(
                parentNode?.type == 'statement_block' ||
                parentNode?.type == 'program' ||
                parentNode?.type == 'for_statement'
            )
        ) {
            if (parentNode?.parent != null) parentNode = parentNode?.parent;
        }

        const theEnv = (parentNode as ScopeContainer).env;

        if (theEnv[varName] == null) theEnv[varName] = { ...node, kind };
        else this.addError(node, 'redeclaring variable!');
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
