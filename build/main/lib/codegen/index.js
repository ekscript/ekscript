"use strict";
/**
* ===================================
* C Generator backend for EkScript
* ---
* This is the C Generator Backend for EkScript
* ===================================
* */
Object.defineProperty(exports, "__esModule", { value: true });
const codegenResolverUtils_1 = require("../utils/codegenResolverUtils");
const iterators_1 = require("../utils/iterators");
const number_1 = require("../utils/number");
const errorHandler_1 = require("../compiler/errorHandler");
const binaryExprGen_1 = require("./binaryExprGen");
const constantFunctions_1 = require("./constantFunctions");
// TODO: Uncomment later
// import { generateArrayUtils } from './constantFunctions';
// import { getArrayName } from './utils/misc';
// TODO: uncomment later
// import { genStringUtil } from './utils/utils1';
// --------------------------------------------
class CodeGen {
    constructor(ast, errors = [], warnings = [], generators = {}) {
        this.ast = ast;
        this.errors = errors;
        this.warnings = warnings;
        this.generators = generators;
        this.utils = [];
        // only named as 'stdbool', 'string' etc
        this.includes = [];
        this.alreadyImportedIncludes = new Set();
        this._singleLineStart = false;
        this.currLine = [];
        this.indentLevel = 0;
        this.functions = [];
        this.currentFunc = {
            name: 'main',
            returnType: 'int',
            body: [],
            funcArgs: [
                ['int', 'argc'],
                ['char', '**argv'],
            ],
            destructors: [],
        };
        this.numTempVars = 0;
        this.specialFlag = false;
        this.specialLine = [];
        this.getFinalCode = () => {
            const stiched = codegenResolverUtils_1.stitchFunctions(this.functions);
            return [
                ...this.includes,
                constantFunctions_1.generateFromGenerators(this.generators),
                ...this.utils,
                stiched,
            ].join('\n');
        };
        this.addInclude = (lib) => {
            if (!this.alreadyImportedIncludes.has(lib)) {
                this.includes.push(`#include<${lib}.h>`);
                this.alreadyImportedIncludes.add(lib);
            }
        };
        this.addUtils = (line) => this.utils.push(line);
        this.currentScope = this.ast.rootNode;
    }
    get singleLineStart() {
        return this._singleLineStart;
    }
    set singleLineStart(v) {
        this._singleLineStart = v;
        if (v == false)
            this.currLine = [];
    }
    printAst() {
        console.log(this.ast.rootNode.toString());
    }
    compileToC(ast) {
        if (ast)
            this.ast = ast;
        this.visit(this.ast.rootNode);
        return this.getFinalCode();
    }
    addLine() {
        if (!this.specialFlag) {
            if (this.currLine.length != 0) {
                this.currentFunc.body.push(this.indent + this.currLine.join(' '));
            }
            this.singleLineStart = false;
        }
    }
    addCol(col) {
        if (this.singleLineStart && col.length != 0) {
            if (this.specialFlag) {
                this.specialLine.push(col);
            }
            else {
                this.currLine.push(col);
            }
        }
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
    get indent() {
        let indentStr = '';
        for (let i = 0; i < this.indentLevel; i++)
            indentStr += '  ';
        return indentStr;
    }
    // ----------- all the visitors ---------
    visit(node) {
        switch (node.type) {
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
            case 'statement_block': {
                this.visitStmtBlock(node);
                break;
            }
            case 'while_statement': {
                this.visitWhileStmt(node);
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
            case 'break_statement': {
                this.visitBreakStmt();
                break;
            }
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
            case 'assignment_expression': {
                this.visitAssignmentExpr(node);
                break;
            }
            case 'sequence_expression': {
                this.visitSeqExpr(node);
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
            case 'if_statement': {
                this.visitIfStmt(node);
                break;
            }
            case 'else_clause': {
                this.visitElseClause(node);
                break;
            }
            case 'string': {
                this.visitString(node);
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
            case 'lexical_declaration': {
                this.visitLexicalDecl(node);
                break;
            }
            case 'type_alias_declaration': {
                this.visitTypeAliasDeclaration(node);
                break;
            }
            default: {
                console.log('--->', node === null || node === void 0 ? void 0 : node.toString());
                throw new Error('Error compiling some weird shit!');
            }
        }
    }
    visitProgram(node) {
        this.currentScope = node;
        this.indentLevel++;
        if (node.childCount == 0) {
            this.singleLineStart = true;
            this.addCol('return 0 ;');
            this.addLine();
            this.functions.push(this.currentFunc);
            return;
        }
        for (const { child } of iterators_1.loopNodeChildren(node))
            this.visit(child);
        this.addDestructors(node);
        this.currentFunc.destructors.push(this.indent + 'return 0;');
        this.indentLevel--;
        this.functions.push(this.currentFunc);
    }
    // ------ Statements Visitor --------
    visitExprStmt(node, nextLine = true) {
        this.singleLineStart = true;
        for (const { child } of iterators_1.loopNamedNodeChild(node)) {
            this.visit(child);
        }
        this.addCol(';');
        if (nextLine)
            this.addLine();
    }
    visitIfStmt(node) {
        this.singleLineStart = true;
        this.addCol('if');
        this.visitParenExpr(node.conditionNode);
        if (node.consequenceNode.type == 'statement_block') {
            this.visitStmtBlock(node.consequenceNode);
        }
        else {
            this.addCol('{');
            this.addLine();
            this.indentLevel++;
            this.singleLineStart = true;
            this.visit(node.consequenceNode);
            this.indentLevel--;
            this.singleLineStart = true;
            this.addCol('}');
        }
        if (node.alternativeNode == null)
            this.addLine();
        for (const { child } of iterators_1.loopNamedNodeChild(node)) {
            if (child.type == 'else_clause') {
                this.singleLineStart = true;
                this.addCol('else');
                this.visitElseClause(child);
                this.addLine();
            }
        }
    }
    visitElseClause(node) {
        this.currentScope = node;
        const consequence = node.firstNamedChild;
        this.addCol('{');
        this.addLine();
        this.indentLevel++;
        if (consequence.type == 'expression_statement') {
            this.singleLineStart = true;
            this.visitExprStmt(consequence);
            this.singleLineStart = true;
        }
        else {
            this.visit(consequence);
        }
        this.addDestructors(node);
        this.indentLevel--;
        this.singleLineStart = true;
        this.addCol('}');
        this.addLine();
    }
    visitWhileStmt(node) {
        this.singleLineStart = true;
        this.addCol('while');
        this.visitParenExpr(node.conditionNode);
        if (node.bodyNode.type == 'statement_block') {
            this.visitStmtBlock(node.bodyNode);
            this.addLine();
        }
        else {
            this.addLine();
            this.indentLevel++;
            this.singleLineStart = true;
            this.visit(node.bodyNode);
            this.indentLevel--;
        }
    }
    visitForStmt(node) {
        this.currentScope = node;
        const initializer = node.initializerNode;
        const condition = node.conditionNode;
        const increment = node.incrementNode;
        const body = node.bodyNode;
        this.singleLineStart = true;
        this.addCol('{');
        this.addLine();
        this.indentLevel++;
        this.singleLineStart = true;
        switch (initializer.type) {
            case 'empty_statement': {
                this.addCol('for ( ;');
                break;
            }
            case 'variable_declaration':
            case 'lexical_declaration': {
                this.visitLexicalDecl(initializer);
                this.singleLineStart = true;
                this.addCol('for ( ;');
                break;
            }
            case 'expression_statement': {
                this.visitExprStmt(initializer, false);
                break;
            }
            default:
        }
        if (condition.type == 'empty_statement')
            this.addCol(';');
        else if (condition.type == 'expression_statement')
            this.visitExprStmt(condition, false);
        this.visit(increment);
        this.addCol(') {');
        this.addLine();
        // statement block
        this.visit(body);
        this.addLine();
        this.addDestructors(node);
        this.indentLevel--;
        this.singleLineStart = true;
        this.addCol('}');
        this.addLine();
    }
    visitEmptyStmt(_node, newLine = true) {
        this.addCol(';');
        if (newLine)
            this.addLine();
    }
    visitStmtBlock(node) {
        this.currentScope = node;
        this.addCol('{');
        this.addLine();
        this.indentLevel++;
        for (const { child } of iterators_1.loopNamedNodeChild(node))
            this.visit(child);
        this.currentScope = node;
        this.addDestructors(node);
        this.indentLevel--;
        this.singleLineStart = true;
        this.addCol('}');
    }
    visitSwitchStmt(node) {
        this.singleLineStart = true;
        this.addCol('switch');
        this.visit(node.valueNode);
        this.addCol('{');
        this.addLine();
        this.indentLevel++;
        const body = node.bodyNode;
        for (const { child } of iterators_1.loopNamedNodeChild(body)) {
            this.singleLineStart = true;
            if (child.type == 'switch_case') {
                const consequence = child.namedChildCount > 1 ? child.lastNamedChild : null;
                this.addCol('case');
                this.visit(child.valueNode);
                this.addCol(':');
                if (consequence)
                    this.visit(consequence);
            }
            else {
                this.addCol('default :');
                if (child.namedChildCount == 0)
                    this.addCol(';');
                else
                    this.visit(child.lastNamedChild);
            }
            this.addLine();
        }
        this.indentLevel--;
        this.singleLineStart = true;
        this.addCol('}');
        this.addLine();
    }
    visitBreakStmt() {
        this.singleLineStart = true;
        this.addCol('break ;');
        this.addLine();
    }
    // ------ Declarations -----------
    // TODO: identifier type through the syntaxnode.
    // cases: let i; let i: string; let i = 'hello'; let i: string = 'hello';
    // let i: string = 'hello', i: int = 1
    visitLexicalDecl(node) {
        for (const { child } of iterators_1.loopNamedNodeChild(node))
            this.visitVariableDeclarator(child);
    }
    visitVariableDeclarator(node) {
        var _a, _b;
        this.singleLineStart = true;
        if (node.isConst) {
            if (node.variableType != 'array' && node.variableType != 'object')
                this.addCol('const');
        }
        const { nameNode, valueNode } = node;
        const idName = nameNode.text;
        if ((valueNode === null || valueNode === void 0 ? void 0 : valueNode.variableType) == 'boolean')
            this.addInclude('stdbool');
        if (node.variableType == 'array') {
            this.addInclude('stdlib');
            // @ts-ignore
            const array_name = (_a = node.subVariableType) === null || _a === void 0 ? void 0 : _a.typeAlias;
            this.addCol(`${array_name}`);
        }
        else if (node.variableType == 'object') {
            const typeAlias = (_b = node === null || node === void 0 ? void 0 : node.subVariableType) === null || _b === void 0 ? void 0 : _b.typeAlias;
            this.addCol(typeAlias + '*');
        }
        else {
            if (node.variableType == 'boolean')
                this.addCol('bool');
            else
                this.addCol(node.variableType);
        }
        this.addCol(idName);
        this.addCol('=');
        if (valueNode != null) {
            if (codegenResolverUtils_1.matchLiteralType(valueNode.type) ||
                valueNode.type == 'identifier' ||
                valueNode.type == 'parenthesized_expression') {
                if (valueNode.type == 'string')
                    this.addInclude('ekstr');
                this.visit(valueNode);
            }
            else {
                // for arrays and objects
                if (valueNode.type == 'binary_expression' &&
                    valueNode.variableType == 'string') {
                    const { rightNode, leftNode } = valueNode;
                    if (rightNode.type == 'identifier' || leftNode.type == 'identifier') {
                        this.currentScope.destructors[idName] = 'string';
                    }
                }
                this.visit(valueNode);
            }
        }
        else {
            console.error(':549: ', 'ERROR. valueNode == null');
        }
        this.addCol(';');
        this.addLine();
    }
    visitTypeAnnotation(node) {
        node;
        // visitTypeAnnotation(this, node);
    }
    visitTypeAliasDeclaration(node) {
        this.singleLineStart = true;
        const { variableType, nameNode } = node;
        this.addCol(`typedef ${variableType} ${nameNode.text} ;`);
        this.addLine();
    }
    // ------ Expression visitor -------
    visitAssignmentExpr(node) {
        const { leftNode, rightNode } = node;
        this.visit(leftNode);
        this.addCol('=');
        if (rightNode.type == 'string') {
            this.addCol(`init_string ( ${rightNode.text}, ${rightNode.text.length - 2} )`);
        }
        else {
            this.visit(rightNode);
        }
    }
    visitBinaryExpr(node) {
        binaryExprGen_1.visitBinaryExpr(this, node);
    }
    visitParenExpr(node) {
        this.addCol('(');
        this.visit(node.firstNamedChild);
        this.addCol(')');
    }
    visitUnaryExpr(node) {
        var _a, _b;
        this.addCol((_a = node === null || node === void 0 ? void 0 : node.child(0)) === null || _a === void 0 ? void 0 : _a.text);
        this.addCol((_b = node === null || node === void 0 ? void 0 : node.child(1)) === null || _b === void 0 ? void 0 : _b.text);
    }
    visitSeqExpr(node) {
        this.visit(node.leftNode);
        this.addCol(',');
        this.visit(node.rightNode);
    }
    visitSubscriptExpr(node) {
        console.log(':608:subscript: ', node.toString());
    }
    visitMemberExpr(node) {
        console.log('member expr:', node.toString());
    }
    visitPropertyIdentifier(node) {
        console.log('prop identifier:', node.toString());
    }
    // ----- literal and identifier -----
    visitArray(node) {
        this.singleLineStart = true;
        this.addInclude('stdlib');
        // HERE IS THE ERROR
        const array_name = node.subVariableType.typeAlias;
        const varName = `temp${this.numTempVars++}`;
        this.addToCurrentFunc(`${array_name} ${varName} = init_${array_name} ( ${node.namedChildCount} ) ;`);
        for (const { child, i } of iterators_1.loopNamedNodeChild(node)) {
            this.visit(child);
            this.addToCurrentFunc(`${varName}.value[${i}] = ${this.currLine.pop()} ;`);
        }
        this.addCol(varName);
    }
    visitObject(node) {
        var _a;
        const objectType = (_a = node === null || node === void 0 ? void 0 : node.subVariableType) === null || _a === void 0 ? void 0 : _a.typeAlias;
        if (objectType) {
            const varName = `temp${this.numTempVars++}`;
            this.addToCurrentFunc(`${objectType}* ${varName} = init_${objectType} () ;`);
            // this.addCol(`init_${} (`);
            for (const { child } of iterators_1.loopNamedNodeChild(node)) {
                const key = child.firstNamedChild;
                const value = child.lastNamedChild;
                if (value != null && key != null) {
                    if (value)
                        this.visit(value);
                    this.addToCurrentFunc(`${varName}->${key.text} = ${this.currLine.pop()} ;`);
                }
                else {
                    this.addError(child, 'key/value might possibly be null');
                }
            }
            this.addCol(varName);
        }
        else {
            this.addError(node, 'Object type not declared. Error while generation');
        }
    }
    visitChar(node) {
        this.addCol(node === null || node === void 0 ? void 0 : node.text);
    }
    visitInt(node) {
        this.addCol(number_1.removeUnderscore(node === null || node === void 0 ? void 0 : node.text));
    }
    visitBigInt(node) {
        this.addCol(number_1.removeUnderscore(node === null || node === void 0 ? void 0 : node.text));
    }
    visitFloat(node) {
        this.addCol(number_1.removeUnderscore(node === null || node === void 0 ? void 0 : node.text));
    }
    visitBoolean(node) {
        this.addInclude('stdbool');
        this.addCol(node.text);
    }
    addString(str, varName) {
        this.addInclude('ekstr');
        this.currentFunc.body.push(`${this.indent}const string ${varName} = init_string ( ${str}, ${str.length - 2} ) ;`);
        this.currentScope.destructors[varName] = 'string';
    }
    addToCurrentFunc(str) {
        this.currentFunc.body.push(this.indent + str);
    }
    visitString(node) {
        const varName = `temp${this.numTempVars++}`;
        this.addString(node.text, varName);
        this.addCol(varName);
    }
    visitIdentifier(node) {
        this.addCol(node.text);
    }
    // ----- utils ----------
    addDestructors(node) {
        for (const varName in node.destructors) {
            this.singleLineStart = true;
            this.addCol(`destroy_${node.destructors[varName]} ( ${varName} ) ;`);
            this.addLine();
        }
    }
}
exports.default = CodeGen;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NvZGVnZW4vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7SUFNSTs7QUEwQ0osd0VBR3VDO0FBQ3ZDLGtEQUEwRTtBQUMxRSw0Q0FBbUQ7QUFDbkQsMkRBQThEO0FBQzlELG1EQUFpRDtBQUVqRCwyREFBNkQ7QUFFN0Qsd0JBQXdCO0FBQ3hCLDREQUE0RDtBQUM1RCwrQ0FBK0M7QUFFL0Msd0JBQXdCO0FBQ3hCLGtEQUFrRDtBQUNsRCwrQ0FBK0M7QUFDL0MsTUFBTSxPQUFPO0lBNkJYLFlBQ1UsR0FBUyxFQUNULFNBQTJCLEVBQUUsRUFDN0IsV0FBNkIsRUFBRSxFQUMvQixhQUE4QyxFQUFFO1FBSGhELFFBQUcsR0FBSCxHQUFHLENBQU07UUFDVCxXQUFNLEdBQU4sTUFBTSxDQUF1QjtRQUM3QixhQUFRLEdBQVIsUUFBUSxDQUF1QjtRQUMvQixlQUFVLEdBQVYsVUFBVSxDQUFzQztRQWhDbEQsVUFBSyxHQUFhLEVBQUUsQ0FBQztRQUU3Qix3Q0FBd0M7UUFDaEMsYUFBUSxHQUFhLEVBQUUsQ0FBQztRQUN4Qiw0QkFBdUIsR0FBZ0IsSUFBSSxHQUFHLEVBQVUsQ0FBQztRQUV6RCxxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDekIsYUFBUSxHQUFhLEVBQUUsQ0FBQztRQUN4QixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUVoQixjQUFTLEdBQWtCLEVBQUUsQ0FBQztRQUN0QyxnQkFBVyxHQUFnQjtZQUN6QixJQUFJLEVBQUUsTUFBTTtZQUNaLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLElBQUksRUFBRSxFQUFFO1lBQ1IsUUFBUSxFQUFFO2dCQUNSLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztnQkFDZixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7YUFDbkI7WUFDRCxXQUFXLEVBQUUsRUFBRTtTQUNoQixDQUFDO1FBQ0YsZ0JBQVcs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