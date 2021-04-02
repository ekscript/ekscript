"use strict";
/**
 * ===================================================
 * Resolver is many things.
 * But first and foremost, it contains the type-checker
 * And the semantic analyzer
 * Further, visitors simplify each node, add Type Metadat
 * for code generator
 * ===================================================
 * */
Object.defineProperty(exports, "__esModule", { value: true });
const codegenResolverUtils_1 = require("../utils/codegenResolverUtils");
const iterators_1 = require("../utils/iterators");
const errorHandler_1 = require("../compiler/errorHandler");
const typeResolver_1 = require("./typeResolver");
const arrayObjectResolver_1 = require("./arrayObjectResolver");
const variableDeclResolver_1 = require("./variableDeclResolver");
const exprResolver_1 = require("./exprResolver");
const fileOps_1 = require("../utils/fileOps");
// -------------------
// @ts-ignore
global.logFactory = fileOps_1.logFactory;
class Resolver {
    constructor(tree, errors, warnings) {
        this.tree = tree;
        this.errors = errors;
        this.warnings = warnings;
        this._generators = {};
        this.counter = 0;
        this.currentScope = this.tree.rootNode;
    }
    get generators() {
        return this._generators;
    }
    // --------- visit --------------
    visit(node) {
        switch (node.type) {
            case 'program': {
                this.visitProgram(node);
                break;
            }
            case 'comment': {
                break;
            }
            case 'expression_statement': {
                this.visitExprStmt(node);
                break;
            }
            case 'if_statement': {
                this.visitIfStmt(node);
                break;
            }
            case 'while_statement': {
                this.visitWhileStmt(node);
                break;
            }
            case 'empty_statement': {
                break;
            }
            case 'for_statement': {
                this.visitForStmt(node);
                break;
            }
            case 'switch_statement': {
                this.visitSwitchStmt(node);
                break;
            }
            case 'binary_expression':
                this.visitBinaryExpr(node);
                break;
            case 'int_literal': {
                this.visitInt(node);
                break;
            }
            case 'bigint_literal': {
                this.visitBigInt(node);
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
            case 'array': {
                this.visitArray(node);
                break;
            }
            case 'object': {
                this.visitObject(node);
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
            case 'assignment_expression': {
                this.visitAssignmentExpr(node);
                break;
            }
            case 'sequence_expression': {
                this.visitSeqExpr(node);
                break;
            }
            case 'subscript_expression': {
                this.visitSubscriptExpr(node);
                break;
            }
            case 'member_expression': {
                this.visitMemberExpr(node);
                break;
            }
            case 'type_identifier':
            case 'identifier': {
                this.visitIdentifier(node);
                break;
            }
            case 'property_identifier': {
                this.visitPropertyIdentifier(node);
                break;
            }
            case 'boolean':
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
            case 'statement_block': {
                this.visitStmtBlock(node);
                break;
            }
            case 'break_statement': {
                this.visitBreakStmt(node);
                break;
            }
            case 'type_annotation': {
                this.visitTypeAnnotation(node);
                break;
            }
            case 'type_alias_declaration': {
                this.visitTypeAliasDeclaration(node);
                break;
            }
            default: {
                console.log('-->', node.toString());
                throw new Error('Error compiling some weird shit!');
            }
        }
        return this;
    }
    visitEmptyStmt(node) {
        node;
    }
    visitProgram(node) {
        node.destructors = {};
        node.env = {};
        this.currentScope = node;
        for (const { child } of iterators_1.loopNamedNodeChild(node))
            this.visit(child);
    }
    // ---------- statements --------
    visitExprStmt(node) {
        var _a;
        if (node.namedChildCount > 0) {
            this.visit(node.firstNamedChild);
            node.variableType = (_a = node.firstNamedChild) === null || _a === void 0 ? void 0 : _a.variableType;
        }
        else {
            node.variableType = 'void';
        }
    }
    visitIfStmt(node) {
        const condition = node.conditionNode;
        const ifConsequence = node.consequenceNode;
        this.visit(condition);
        const vType = condition.variableType;
        if (vType != 'boolean' && vType != 'true' && vType != 'false') {
            this.addError(condition, `Only boolean expressions allowed`);
        }
        this.visit(ifConsequence);
        for (const { child } of iterators_1.loopNamedNodeChild(node)) {
            switch (child.type) {
                case 'parenthesized_expression':
                case 'statement_block':
                    continue;
                case 'else_clause':
                    this.visitElseClause(child);
                    break;
                default:
            }
        }
    }
    visitElseClause(node) {
        node.destructors = {};
        node.env = {};
        this.currentScope = node;
        if (node.firstNamedChild)
            this.visit(node.firstNamedChild);
    }
    visitStmtBlock(node) {
        node.destructors = {};
        node.env = {};
        for (const { child } of iterators_1.loopNamedNodeChild(node)) {
            this.currentScope = node;
            this.visit(child);
        }
    }
    visitWhileStmt(node) {
        const condition = node.conditionNode;
        this.visit(condition);
        const vType = condition.variableType;
        if (vType != 'boolean' && vType != 'true' && vType != 'false') {
            this.addError(condition, `Only boolean expressions allowed`);
        }
        this.visit(node.bodyNode);
    }
    visitForStmt(node) {
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
        if (updateNode != null)
            this.visit(updateNode);
        this.visit(body);
    }
    visitSwitchStmt(node) {
        const value = node.valueNode;
        this.visit(value);
        node.variableType = value.variableType;
        const body = node.bodyNode;
        for (const { child } of iterators_1.loopNamedNodeChild(body)) {
            const consequence = child.namedChildCount > 1 ? child.lastNamedChild : null;
            if (child.type == 'switch_case') {
                const caseVal = child.valueNode;
                this.visit(caseVal);
                if (caseVal.variableType != value.variableType) {
                    this.addError(caseVal, 'Incompatible types switch value and case');
                }
            }
            if (consequence)
                this.visit(consequence);
        }
    }
    visitBreakStmt(node) {
        let flag = false;
        const recValid = (node) => {
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
                    if (node.parent)
                        recValid(node.parent);
                }
            }
        };
        recValid(node);
        if (flag == false) {
            this.addError(node, 'break is only present inside for, while, do-while and switch-case');
        }
    }
    //  -------- identifiers & literals ----------
    visitInt(node) {
        node.variableType = 'int';
    }
    visitBoolean(node) {
        node.variableType = 'boolean';
    }
    visitFloat(node) {
        node.variableType = 'float';
    }
    visitBigInt(node) {
        node.variableType = 'bigint';
    }
    visitChar(node) {
        node.variableType = 'char';
    }
    visitString(node) {
        node.variableType = 'string';
        // TODO: modify multilined strings to single lined
    }
    visitIdentifier(node) {
        const id = codegenResolverUtils_1.getEnvValueRecursively(node.text, node);
        if (id == null)
            this.addError(node, 'Undefined variable');
        else {
            node.variableType = id.variableType;
            node.subVariableType = id.subVariableType;
            node.isConst = id.isConst;
        }
    }
    visitPropertyIdentifier(node) {
        console.log('prop:', node.toString());
    }
    visitArray(node, generator = false) {
        arrayObjectResolver_1.visitArray(this, node, generator);
    }
    visitObject(node, generator = false) {
        arrayObjectResolver_1.visitObject(this, node, generator);
    }
    // ------ expressions ---------
    visitBinaryExpr(node) {
        exprResolver_1.visitBinaryExpr(this, node);
    }
    visitUnaryExpr(node) {
        exprResolver_1.visitUnaryExpr(this, node);
    }
    visitParenExpr(node) {
        var _a;
        this.visit(node.firstNamedChild);
        node.variableType = (_a = node.firstNamedChild) === null || _a === void 0 ? void 0 : _a.variableType;
    }
    visitAssignmentExpr(node) {
        const left = node.leftNode;
        const right = node.rightNode;
        this.visit(left);
        this.visit(right);
        if (!codegenResolverUtils_1.compareVariableTypes(left.variableType, left.subVariableType, right.variableType, right.subVariableType)) {
            this.addError(node, `Cannot assign variable of type "${left.variableType}" to "${right.variableType}"`);
        }
        else {
            node.variableType = left.variableType;
        }
    }
    visitSeqExpr(node) {
        this.visit(node.leftNode);
        this.visit(node.rightNode);
        if (node.rightNode.variableType != null)
            node.variableType = node.rightNode.variableType;
    }
    visitSubscriptExpr(node) {
        const obj = node.objectNode;
        const index = node.indexNode;
        this.visit(obj);
        this.visit(index);
        switch (index.variableType) {
            case 'int': {
                if (obj.variableType != 'array' && obj.variableType != 'string') {
                    this.addError(obj, `Cannot access ${index.text} of type ${obj.variableType}`);
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
    visitMemberExpr(node) {
        var _a;
        const { objectNode, propertyNode } = node;
        this.visit(objectNode);
        if (objectNode.subVariableType != null) {
            const idType = (_a = objectNode.subVariableType) === null || _a === void 0 ? void 0 : _a.fields[propertyNode.text];
            if (idType != null) {
                if (typeof idType == 'string')
                    node.variableType = idType;
                else
                    node.subVariableType = idType;
            }
            else {
                this.addError(objectNode, 'Undefined call');
            }
        }
    }
    // ----- declarations
    visitLexicalDecl(node) {
        var _a;
        const isConst = ((_a = node.child(0)) === null || _a === void 0 ? void 0 : _a.type) == 'const';
        node.isConst = isConst;
        for (const { child } of iterators_1.loopNamedNodeChild(node)) {
            child.isConst = isConst;
            this.visitVariableDeclarator(child);
        }
    }
    visitVariableDeclarator(node) {
        variableDeclResolver_1.visitVariableDeclarator(this, node);
    }
    visitTypeAnnotation(node, generator = false) {
        typeResolver_1.visitTypeAnnotation(this, node, generator);
    }
    // --------- TypeAlias ------
    visitObjectType(node) {
        typeResolver_1.visitObjectType(this, node);
    }
    visitTypeAliasDeclaration(node) {
        typeResolver_1.visitTypeAliasDeclaration(this, node);
    }
    // --------- utils ----------
    addIdentifierToEnv(node, kind) {
        const varName = node.text;
        let parentNode = node === null || node === void 0 ? void 0 : node.parent;
        while (!((parentNode === null || parentNode === void 0 ? void 0 : parentNode.type) == 'statement_block' ||
            (parentNode === null || parentNode === void 0 ? void 0 : parentNode.type) == 'program' ||
            (parentNode === null || parentNode === void 0 ? void 0 : parentNode.type) == 'for_statement')) {
            if ((parentNode === null || parentNode === void 0 ? void 0 : parentNode.parent) != null)
                parentNode = parentNode === null || parentNode === void 0 ? void 0 : parentNode.parent;
        }
        const theEnv = parentNode.env;
        if (theEnv[varName] == null)
            theEnv[varName] = Object.assign(Object.assign({}, node), { kind });
        else
            this.addError(node, 'redeclaring variable!');
    }
    addError(node, errorMessage) {
        var _a, _b;
        this.errors.push({
            line: (_a = node.startPosition.row) !== null && _a !== void 0 ? _a : 0,
            pos: (_b = node.startPosition.column) !== null && _b !== void 0 ? _b : 0,
            errorMessage,
            errorType: errorHandler_1.TCompilerErrorType.COMPILE_ERROR,
        });
    }
    addWarning(node, errorMessage) {
        var _a, _b;
        this.warnings.push({
            line: (_a = node.startPosition.row) !== null && _a !== void 0 ? _a : 0,
            pos: (_b = node.startPosition.column) !== null && _b !== void 0 ? _b : 0,
            errorMessage,
            errorType: errorHandler_1.TCompilerErrorType.COMPILE_ERROR,
        });
    }
    // TODO: Reduce complex types
    reduceComplexType(node) {
        return node.text;
    }
}
exports.default = Resolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3Jlc29sdmVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7S0FRSzs7QUFnREwsd0VBR3VDO0FBQ3ZDLGtEQUF3RDtBQUN4RCwyREFBOEQ7QUFFOUQsaURBSXdCO0FBQ3hCLCtEQUFnRTtBQUNoRSxpRUFBaUU7QUFDakUsaURBQWlFO0FBRWpFLDhDQUE4QztBQUU5QyxzQkFBc0I7QUFDdEIsYUFBYTtBQUNiLE1BQU0sQ0FBQyxVQUFVLEdBQUcsb0JBQVUsQ0FBQztBQUUvQixNQUFxQixRQUFRO0lBSzNCLFlBQ1UsSUFBVSxFQUNWLE1BQXdCLEVBQ3hCLFFBQTBCO1FBRjFCLFNBQUksR0FBSixJQUFJLENBQU07UUFDVixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQUN4QixhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQU5wQyxnQkFBVyxHQUFvQyxFQUFFLENBQUM7UUFDbEQsWUFBTyxHQUFHLENBQUMsQ0FBQztRQU9WLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUF1QixDQUFDO0lBQ3hELENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVELGlDQUFpQztJQUNqQyxLQUFLLENBQUMsSUFBZ0I7UUFDcEIsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2pCLEtBQUssU0FBUyxDQUFDLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFtQixDQUFDLENBQUM7Z0JBQ3ZDLE1BQU07YUFDUDtZQUNELEtBQUssU0FBUyxDQUFDLENBQUM7Z0JBQ2QsTUFBTTthQUNQO1lBQ0QsS0FBSyxzQkFBc0IsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQStCLENBQUMsQ0FBQztnQkFDcEQsTUFBTTthQUNQO1lBQ0Qs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