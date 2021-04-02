"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitObject = exports.visitArray = void 0;
const iterators_1 = require("../utils/iterators");
const codegenResolverUtils_1 = require("../utils/codegenResolverUtils");
const fileOps_1 = require("../utils/fileOps");
const log = fileOps_1.logFactory(__filename);
/**
 * @param Resolver class instance
 * @param ArrayNode that is to be processed
 * @param generator flag for whether to generate array structs
 * */
function visitArray(resolver, node, generator = false) {
    var _a, _b;
    node.variableType = 'array';
    const subVariableType = {
        subTypes: [],
        variableType: 'array',
    };
    if (node.namedChildCount == 0)
        return; // if empty array, return
    const complexFieldTypes = []; // this is specially relevant for tuples: later
    const stringFieldTypes = new Set(); // basic types: int, float, string, boolean, null
    // let generatorMod = generator;
    // for (const { child } of loopNamedNodeChild(node)) {
    //   // if one of the child is an identifier, simply ignore
    //   if (child.type == 'identifier') generatorMod = false;
    // }
    for (const { child } of iterators_1.loopNamedNodeChild(node)) {
        if (child.type == 'comment')
            continue;
        else if (child.type == 'array')
            visitArray(resolver, child, generator);
        else if (child.type == 'object')
            resolver.visitObject(child, generator);
        else
            resolver.visit(child);
        switch (child.variableType) {
            case 'object':
            case 'array': {
                let isPresent = false;
                for (let i = 0; i < complexFieldTypes.length; i++) {
                    const varB = complexFieldTypes[i];
                    if (codegenResolverUtils_1.compareVariableTypes(child.variableType, child.subVariableType, varB.variableType, varB)) {
                        isPresent = true; // if type is present already in the array
                        break;
                    }
                }
                const subVarType = child.subVariableType;
                // if subVarType is present, push the type to complexFieldTypes
                if (!isPresent && subVarType)
                    complexFieldTypes.push(subVarType);
                break;
            }
            default: {
                // if the type is a basic type, int, string, float, boolean, null
                stringFieldTypes.add(child.variableType);
                break;
            }
        }
    }
    if (complexFieldTypes.length == 0 && stringFieldTypes.size == 0)
        return;
    // push this to the array finally
    complexFieldTypes.forEach((fT) => { var _a; return (_a = subVariableType.subTypes) === null || _a === void 0 ? void 0 : _a.push(fT); });
    for (const fT of stringFieldTypes)
        (_a = subVariableType.subTypes) === null || _a === void 0 ? void 0 : _a.push(fT);
    const typeAlias = `anon_array${resolver.counter++}`;
    subVariableType.typeAlias = typeAlias;
    node.subVariableType = subVariableType;
    const subV = (_b = node.firstNamedChild) === null || _b === void 0 ? void 0 : _b.subVariableType;
    if (subV != null) {
        for (const { child, i } of iterators_1.loopNamedNodeChild(node)) {
            if (i != 0) {
                const duplicates = codegenResolverUtils_1.mirrorAnonNameInComplexTypes(subV, child.subVariableType);
                duplicates.forEach((dup) => delete resolver._generators[dup]);
            }
        }
    }
    if (generator)
        resolver._generators[typeAlias] = subVariableType;
}
exports.visitArray = visitArray;
/*
 * @param {resolver} Resolver class
 * @param {node}
 * @param {generator} flag for generating object structs
 * */
function visitObject(resolver, node, generator = false) {
    node.variableType = 'object';
    const subVariableType = {
        subTypes: [],
        variableType: 'object',
        fields: {},
    };
    for (const { child } of iterators_1.loopNamedNodeChild(node)) {
        const { keyNode, valueNode } = child;
        if (valueNode.type == 'array')
            resolver.visitArray(valueNode, generator);
        else if (valueNode.type == 'object')
            resolver.visitObject(valueNode, generator);
        else
            resolver.visit(valueNode);
        const varType = valueNode.variableType;
        const subVarType = valueNode.subVariableType;
        switch (varType) {
            case 'object':
            case 'array': {
                if (subVariableType.fields)
                    subVariableType.fields[keyNode.text] = subVarType;
                break;
            }
            default: {
                subVariableType.fields[keyNode.text] = varType;
                break;
            }
        }
        child.variableType = varType;
        child.subVariableType = valueNode.subVariableType;
        keyNode.variableType = varType;
        keyNode.subVariableType = valueNode.subVariableType;
    }
    // TODO: Work on resolving this with variable declaration
    const typeAlias = `anon_object${resolver.counter++}`;
    if (generator)
        resolver._generators[typeAlias] = subVariableType;
    subVariableType.typeAlias = typeAlias;
    node.subVariableType = subVariableType;
}
exports.visitObject = visitObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXlPYmplY3RSZXNvbHZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvcmVzb2x2ZXIvYXJyYXlPYmplY3RSZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFRQSxrREFBd0Q7QUFDeEQsd0VBR3VDO0FBRXZDLDhDQUE4QztBQUM5QyxNQUFNLEdBQUcsR0FBRyxvQkFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRW5DOzs7O0tBSUs7QUFDTCxTQUFnQixVQUFVLENBQ3hCLFFBQWtCLEVBQ2xCLElBQWUsRUFDZixTQUFTLEdBQUcsS0FBSzs7SUFFakIsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUM7SUFDNUIsTUFBTSxlQUFlLEdBQW9CO1FBQ3ZDLFFBQVEsRUFBRSxFQUFFO1FBQ1osWUFBWSxFQUFFLE9BQU87S0FDdEIsQ0FBQztJQUVGLElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxDQUFDO1FBQUUsT0FBTyxDQUFDLHlCQUF5QjtJQUVoRSxNQUFNLGlCQUFpQixHQUFzQixFQUFFLENBQUMsQ0FBQywrQ0FBK0M7SUFDaEcsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDLENBQUMsaURBQWlEO0lBRTdGLGdDQUFnQztJQUVoQyxzREFBc0Q7SUFDdEQsMkRBQTJEO0lBQzNELDBEQUEwRDtJQUMxRCxJQUFJO0lBRUosS0FBSyxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksOEJBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDaEQsSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLFNBQVM7WUFBRSxTQUFTO2FBQ2pDLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxPQUFPO1lBQzVCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBa0IsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUNqRCxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksUUFBUTtZQUM3QixRQUFRLENBQUMsV0FBVyxDQUFD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