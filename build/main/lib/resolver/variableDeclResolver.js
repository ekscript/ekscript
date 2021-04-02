"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitVariableDeclarator = void 0;
const compiler_1 = require("../../types/compiler");
const codegenResolverUtils_1 = require("../utils/codegenResolverUtils");
const fileOps_1 = require("../utils/fileOps");
const iterators_1 = require("../utils/iterators");
const arrayObjectResolver_1 = require("./arrayObjectResolver");
const typeResolver_1 = require("./typeResolver");
const log = fileOps_1.logFactory(__filename);
/**
 * Resolves `let a: string | null` & untyped `let a = { value: 1 }`
 * _Basically Variable Declarations with 2 nodes_
 * */
function resolveUntypedVarDecl(resolver, node) {
    var _a;
    let { nameNode, typeNode, valueNode } = node;
    let variableType = null;
    let subVariableType = null;
    if (typeNode != null) {
        // Nullable types: `let a: string | null`
        if (((_a = typeNode.firstNamedChild) === null || _a === void 0 ? void 0 : _a.type) != 'union_type') {
            resolver.addError(node, 'Non-nullable types need a initializer');
        }
        else {
            typeResolver_1.visitTypeAnnotation(resolver, typeNode, true);
        }
    }
    else if (valueNode != null) {
        // Initializer included: let a = 1; let b = a; let c = "string";
        if (valueNode.type == 'array') {
            arrayObjectResolver_1.visitArray(resolver, valueNode, true);
        }
        else if (valueNode.type == 'object') {
            arrayObjectResolver_1.visitObject(resolver, valueNode, true);
        }
        else {
            resolver.visit(valueNode);
        }
        variableType = valueNode.variableType;
        if (valueNode.subVariableType)
            subVariableType = valueNode.subVariableType;
    }
    variableType = variableType !== null && variableType !== void 0 ? variableType : '';
    return { nameNode, valueNode, typeNode, variableType, subVariableType };
}
// ---------------------------------------------------------------------
/**
 * Resolves Variable Declarations with 3 nodes
 * `let a: string = {}; let b: Type = { hello: world }`
 * */
function resolveTypedVarDec(resolver, node) {
    let { typeNode, valueNode, nameNode } = node;
    let variableType = '';
    let subVariableType = null;
    if (valueNode && typeNode) {
        if (valueNode.type == 'array') {
            arrayObjectResolver_1.visitArray(resolver, valueNode, true);
        }
        else if (valueNode.type == 'object') {
            arrayObjectResolver_1.visitObject(resolver, valueNode, true);
        }
        else {
            resolver.visit(valueNode);
        }
        const generatorMod = valueNode.variableType == 'array' && valueNode.namedChildCount == 0;
        typeResolver_1.visitTypeAnnotation(resolver, typeNode, generatorMod);
        const valVarType = valueNode.variableType;
        let valSubVarType = valueNode.subVariableType;
        const typeVarType = typeNode.variableType;
        const typeSubVarType = typeNode.subVariableType;
        if (valVarType == 'array' || valVarType == 'object') {
            for (const { child } of iterators_1.loopNamedNodeChild(valueNode)) {
                const duplicates = codegenResolverUtils_1.mirrorAnonNameInComplexTypes(typeSubVarType, child.subVariableType);
                duplicates.forEach((dup) => delete resolver._generators[dup]);
            }
        }
        if (valVarType == 'array' &&
            typeVarType == 'array' &&
            valSubVarType == null &&
            typeSubVarType != null) {
            valueNode.subVariableType = typeNode.subVariableType;
            variableType = typeVarType;
            subVariableType = typeSubVarType;
        }
        else {
            if (codegenResolverUtils_1.compareVariableTypes(typeVarType, typeSubVarType, valVarType, valSubVarType)) {
                variableType = valVarType;
                subVariableType = valSubVarType;
            }
            else {
                resolver.addError(node, "Type Annotation and initiliazer don't match.");
            }
        }
    }
    else {
        resolver.addError(node, 'Either ValueNode or TypeNode is null');
    }
    return { nameNode, valueNode, typeNode, variableType, subVariableType };
}
// ---------------------------------------------------------------------
function visitVariableDeclarator(resolver, node) {
    let variableType = null;
    let subVariableType = null;
    const childCount = node.namedChildCount;
    // if node only has the variable declared and nothing else
    if (node.namedChildCount > 1) {
        // eslint-disable-next-line prefer-const
        let { nameNode, valueNode } = node;
        const resolvedSubType = childCount == 2
            ? resolveUntypedVarDecl(resolver, node)
            : resolveTypedVarDec(resolver, node);
        nameNode = resolvedSubType.nameNode;
        valueNode = resolvedSubType.valueNode;
        variableType = resolvedSubType.variableType;
        subVariableType = resolvedSubType.subVariableType;
        nameNode = nameNode;
        nameNode.isConst = node.isConst ? true : false;
        if (variableType)
            nameNode.variableType = variableType;
        if (subVariableType)
            nameNode.subVariableType = subVariableType;
        // @ts-ignore
        resolver.addIdentifierToEnv(nameNode, compiler_1.IVarKind.variable);
        // if (variableType == 'string') resolver.addDestructor(nameNode);
        node.variableType = variableType;
        if (subVariableType)
            node.subVariableType = subVariableType;
    }
    else {
        resolver.addError(node, `Can't infer Type.`);
    }
}
exports.visitVariableDeclarator = visitVariableDeclarator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGVEZWNsUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3Jlc29sdmVyL3ZhcmlhYmxlRGVjbFJlc29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVdBLG1EQUFnRDtBQUNoRCx3RUFHdUM7QUFDdkMsOENBQThDO0FBQzlDLGtEQUF3RDtBQUV4RCwrREFBZ0U7QUFFaEUsaURBQXFEO0FBRXJELE1BQU0sR0FBRyxHQUFHLG9CQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7QUFVbkM7OztLQUdLO0FBQ0wsU0FBUyxxQkFBcUIsQ0FDNUIsUUFBa0IsRUFDbEIsSUFBNEI7O0lBRTVCLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztJQUM3QyxJQUFJLFlBQVksR0FBa0IsSUFBSSxDQUFDO0lBQ3ZDLElBQUksZUFBZSxHQUEyQixJQUFJLENBQUM7SUFDbkQsSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO1FBQ3BCLHlDQUF5QztRQUN6QyxJQUFJLE9BQUEsUUFBUSxDQUFDLGVBQWUsMENBQUUsSUFBSSxLQUFJLFlBQVksRUFBRTtZQUNsRCxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSx1Q0FBdUMsQ0FBQyxDQUFDO1NBQ2xFO2FBQU07WUFDTCxrQ0FBbUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQy9DO0tBQ0Y7U0FBTSxJQUFJLFNBQVMsSUFBSSxJQUFJLEVBQUU7UUFDNUIsZ0VBQWdFO1FBQ2hFLElBQUksU0FBUyxDQUFDLElBQUksSUFBSSxPQUFPLEVBQUU7WUFDN0IsZ0NBQVUsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3ZDO2FBQU0sSUFBSSxTQUFTLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRTtZQUNyQyxpQ0FBVyxDQUFDLFFBQVEsRUFBRSxTQUFT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