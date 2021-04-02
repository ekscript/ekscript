"use strict";
/**
* ====================
* Resolves the types
* ====================
* */
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitTypeAliasDeclaration = exports.visitTypeAnnotation = exports.visitArrayType = exports.visitObjectType = void 0;
const compiler_1 = require("../../types/compiler");
const iterators_1 = require("../utils/iterators");
const fileOps_1 = require("../utils/fileOps");
const log = fileOps_1.logFactory(__filename);
function visitObjectType(resolver, node, generator = false) {
    var _a;
    node.variableType = 'object';
    const subVariableType = {
        variableType: 'object',
        fields: {},
    };
    for (const { child } of iterators_1.loopNamedNodeChild(node)) {
        const { nameNode, typeNode } = child;
        if (typeNode) {
            visitTypeAnnotation(resolver, typeNode);
            child.variableType = typeNode.variableType;
            child.subVariableType = typeNode.subVariableType;
            // log(
            //   nameNode.text,
            //   typeNode?.firstNamedChild?.type,
            //   typeNode.variableType,
            //   typeNode.subVariableType
            // );
            if (((_a = typeNode === null || typeNode === void 0 ? void 0 : typeNode.firstNamedChild) === null || _a === void 0 ? void 0 : _a.type) == 'predefined_type') {
                subVariableType.fields[nameNode.text] = typeNode.variableType;
            }
            else {
                subVariableType.fields[nameNode.text] = typeNode.subVariableType;
            }
        }
    }
    node.subVariableType = subVariableType;
}
exports.visitObjectType = visitObjectType;
function visitArrayType(resolver, node, generator = false) {
    var _a, _b, _c;
    const mainType = node.firstNamedChild;
    visitTypeAnnotation(resolver, node, generator);
    node.variableType = 'array';
    node.subVariableType = { subTypes: [], variableType: 'array' };
    if (generator) {
        const typeAlias = `anon_array${resolver.counter++}`;
        node.subVariableType.typeAlias = typeAlias;
        resolver._generators[typeAlias] = node.subVariableType;
    }
    switch (mainType.type) {
        case 'predefined_type': {
            if (mainType === null || mainType === void 0 ? void 0 : mainType.variableType)
                (_a = node.subVariableType.subTypes) === null || _a === void 0 ? void 0 : _a.push(mainType === null || mainType === void 0 ? void 0 : mainType.variableType);
            break;
        }
        case 'type_identifier': {
            if (mainType === null || mainType === void 0 ? void 0 : mainType.variableType)
                (_b = node.subVariableType.subTypes) === null || _b === void 0 ? void 0 : _b.push(mainType === null || mainType === void 0 ? void 0 : mainType.variableType);
            break;
        }
        default: {
            if (mainType === null || mainType === void 0 ? void 0 : mainType.subVariableType)
                (_c = node.subVariableType.subTypes) === null || _c === void 0 ? void 0 : _c.push(mainType === null || mainType === void 0 ? void 0 : mainType.subVariableType);
            break;
        }
    }
}
exports.visitArrayType = visitArrayType;
/**
 * Resolves the type annotation node
 * @param node The TypeAnnotationNode
 * @param generator Whether to generate the sub nodes
 **/
function visitTypeAnnotation(resolver, node, generator = false) {
    const mainType = node.firstNamedChild;
    switch (mainType === null || mainType === void 0 ? void 0 : mainType.type) {
        case 'predefined_type': {
            switch (mainType === null || mainType === void 0 ? void 0 : mainType.text) {
                case 'int':
                case 'float':
                case 'boolean':
                case 'string':
                case 'char': {
                    node.variableType = mainType.text;
                    mainType.variableType = mainType.text;
                    break;
                }
                default: {
                    break;
                }
            }
            break;
        }
        case 'array_type': {
            visitArrayType(resolver, mainType, generator);
            node.variableType = mainType.variableType;
            node.subVariableType = mainType.subVariableType;
            break;
        }
        case 'object_type': {
            visitObjectType(resolver, mainType);
            node.variableType = mainType.variableType;
            node.subVariableType = mainType.subVariableType;
            break;
        }
        case 'type_identifier': {
            resolver.visitIdentifier(mainType);
            node.variableType = mainType.variableType;
            node.subVariableType = mainType.subVariableType;
            break;
        }
        default: {
            if (mainType != null)
                console.log('Unknown type..', mainType.toString());
        }
    }
}
exports.visitTypeAnnotation = visitTypeAnnotation;
// --------------------------------------------
function visitTypeAliasDeclaration(resolver, node) {
    const { nameNode, valueNode } = node;
    switch (valueNode.type) {
        case 'predefined_type': {
            const varType = valueNode.text;
            switch (varType) {
                case 'string':
                case 'int':
                case 'float':
                case 'boolean':
                case 'null': {
                    nameNode.variableType = varType;
                    valueNode.variableType = varType;
                    node.variableType = varType;
                    break;
                }
                default: {
                    console.log('visitTypeAliasDeclaration: Unknown type', valueNode.text);
                    break;
                }
            }
            break;
        }
        case 'object_type': {
            log('visitTypeAliasDeclaration: ...');
            visitObjectType(resolver, valueNode);
            const varType = valueNode.variableType;
            const subVarType = valueNode.subVariableType;
            node.variableType = varType;
            node.subVariableType = subVarType;
            nameNode.variableType = varType;
            nameNode.subVariableType = subVarType;
            break;
        }
        default: {
            break;
        }
    }
    // @ts-ignore
    resolver.addIdentifierToEnv(nameNode, compiler_1.IVarKind.typeDef);
}
exports.visitTypeAliasDeclaration = visitTypeAliasDeclaration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZVJlc29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9yZXNvbHZlci90eXBlUmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0lBSUk7OztBQWNKLG1EQUFnRDtBQUNoRCxrREFBd0Q7QUFFeEQsOENBQThDO0FBQzlDLE1BQU0sR0FBRyxHQUFHLG9CQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFbkMsU0FBZ0IsZUFBZSxDQUM3QixRQUFrQixFQUNsQixJQUFvQixFQUNwQixTQUFTLEdBQUcsS0FBSzs7SUFFakIsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7SUFDN0IsTUFBTSxlQUFlLEdBR2pCO1FBQ0YsWUFBWSxFQUFFLFFBQVE7UUFDdEIsTUFBTSxFQUFFLEVBQUU7S0FDWCxDQUFDO0lBRUYsS0FBSyxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksOEJBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDaEQsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsR0FBRyxLQUE4QixDQUFDO1FBQzlELElBQUksUUFBUSxFQUFFO1lBQ1osbUJBQW1CLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRXhDLEtBQUssQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQztZQUMxQyxLQUFtQixDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDO1lBRWhFLE9BQU87WUFDUCxtQkFBbUI7WUFDbkIscUNBQXFDO1lBQ3JDLDJCQUEyQjtZQUMzQiw2QkFBNkI7WUFDN0IsS0FBSztZQUVMLElBQUksT0FBQSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsZUFBZSwwQ0FBRSxJQUFJLEtBQUksaUJBQWlCLEVBQUU7Z0JBQ3hELGVBQWUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxZQUFZLENB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