"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitArray = void 0;
const iterators_1 = require("../utils/iterators");
const codegenResolverUtils_1 = require("../utils/codegenResolverUtils");
/**
  * @param {resolver} Resolver class instance
  * @param {node} ArrayNode that is to be processed
  * @param {generator} flag for whether to generate array or not
  *                     usuallly is false when duplicate
  *                     array structs are to be made
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
    let generatorMod = generator;
    for (const { child } of iterators_1.loopNamedNodeChild(node)) {
        // if one of the child is an identifier, simply ignore
        if (child.type == 'identifier')
            generatorMod = false;
    }
    for (const { child } of iterators_1.loopNamedNodeChild(node)) {
        if (child.type == 'comment')
            continue;
        else if (child.type == 'array')
            visitArray(resolver, child, generatorMod);
        else if (child.type == 'object')
            resolver.visitObject(child, generatorMod);
        else
            resolver.visit(child);
        switch (child.variableType) {
            case 'object':
            case 'array': {
                let isPresent = false;
                for (let i = 0; i < complexFieldTypes.length; i++) {
                    const varB = complexFieldTypes[i];
                    if (codegenResolverUtils_1.compareVariableTypes(
                    // compare the child with all the other types of the array
                    child.variableType, child.subVariableType, varB.variableType, varB)) {
                        isPresent = true; // if type is present already in the array
                        break;
                    }
                }
                const subVarType = child.subVariableType;
                // if subVarType is present, throw the type to complexFieldTypes
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXlSZXNvbHZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvcmVzb2x2ZXIvYXJyYXlSZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFPQSxrREFBd0Q7QUFDeEQsd0VBR3VDO0FBRXZDOzs7Ozs7TUFNTTtBQUNOLFNBQWdCLFVBQVUsQ0FDeEIsUUFBa0IsRUFDbEIsSUFBZSxFQUNmLFNBQVMsR0FBRyxLQUFLOztJQUVqQixJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQztJQUM1QixNQUFNLGVBQWUsR0FBb0I7UUFDdkMsUUFBUSxFQUFFLEVBQUU7UUFDWixZQUFZLEVBQUUsT0FBTztLQUN0QixDQUFDO0lBRUYsSUFBSSxJQUFJLENBQUMsZUFBZSxJQUFJLENBQUM7UUFBRSxPQUFPLENBQUMseUJBQXlCO0lBRWhFLE1BQU0saUJBQWlCLEdBQXNCLEVBQUUsQ0FBQyxDQUFDLCtDQUErQztJQUNoRyxNQUFNLGdCQUFnQixHQUFHLElBQUksR0FBRyxFQUFVLENBQUMsQ0FBQyxpREFBaUQ7SUFFN0YsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDO0lBRTdCLEtBQUssTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLDhCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2hELHNEQUFzRDtRQUN0RCxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksWUFBWTtZQUFFLFlBQVksR0FBRyxLQUFLLENBQUM7S0FDdEQ7SUFFRCxLQUFLLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSw4QkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNoRCxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksU0FBUztZQUFFLFNBQVM7YUFDakMsSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLE9BQU87WUFDNUIsVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFrQixFQUFFLFlBQVksQ0FBQyxDQUFDO2FBQ3BELElBQUksS0FBSyxDQUFD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