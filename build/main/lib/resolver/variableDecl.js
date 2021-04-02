"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitVariableDeclarator = void 0;
const iterators_1 = require("../utils/iterators");
function visitVariableDeclarator(resolver, node) {
    var _a;
    const isConst = node.isConst ? true : false;
    let variableType = '';
    let subVariableType = null;
    const childCount = node.namedChildCount;
    // if node only has the variable declared and nothing else
    if (node.namedChildCount > 1) {
        // eslint-disable-next-line prefer-const
        let { nameNode, typeNode, valueNode } = node;
        if (childCount == 2) {
            if (typeNode != null) {
                // Nullable types: `let a: string | null`
                if (((_a = typeNode.firstNamedChild) === null || _a === void 0 ? void 0 : _a.type) != 'union_type') {
                    // Non-nullable types without initializer: let a: string
                    resolver.addError(node, 'Non-nullable types need a initializer');
                }
                else {
                    resolver.visitTypeAnnotation(typeNode, true);
                }
            }
            else if (valueNode != null) {
                // Initializer included: let a = 1; let b = a; let c = "string";
                if (valueNode.type == 'array')
                    resolver.visitArray(valueNode, true);
                else if (valueNode.type == 'object')
                    resolver.visitObject(valueNode, true);
                else
                    resolver.visit(valueNode);
                variableType = valueNode.variableType;
                if (valueNode.subVariableType)
                    subVariableType = valueNode.subVariableType;
            }
        }
        else if (childCount == 3) {
            if (valueNode && typeNode) {
                resolver.visit(valueNode);
                resolver.visitTypeAnnotation(typeNode, false);
                console.log('-->', valueNode.variableType, valueNode.subVariableType, typeNode.variableType, valueNode.subVariableType);
                const valVarType = valueNode.variableType;
                const valSubVarType = valueNode.subVariableType;
                const typeVarType = typeNode.variableType;
                const typeSubVarType = typeNode.subVariableType;
                if (valVarType == 'array' || valVarType == 'object') {
                    for (const { child } of iterators_1.loopNamedNodeChild(valueNode)) {
                        const duplicates = mirrorAnonNameInComplexTypes(typeSubVarType, child.subVariableType);
                        duplicates.forEach((dup) => delete resolver._generators[dup]);
                    }
                }
                if (valVarType == 'array' &&
                    typeVarType == 'array' &&
                    valSubVarType == null &&
                    typeSubVarType != null) {
                    variableType = typeVarType;
                    subVariableType = typeSubVarType;
                }
                else if (compareVariableTypes(typeVarType, typeSubVarType, valVarType, valSubVarType)) {
                    variableType = valVarType;
                    subVariableType = valSubVarType;
                }
                else {
                    resolver.addError(node, "Type Annotation and initiliazer don't match.");
                }
            }
        }
        nameNode = nameNode;
        nameNode.isConst = isConst;
        nameNode.variableType = variableType;
        nameNode.subVariableType = subVariableType;
        resolver.addIdentifierToEnv(nameNode, IVarKind.variable);
        // if (variableType == 'string') resolver.addDestructor(nameNode);
        node.variableType = variableType;
        node.subVariableType = subVariableType;
    }
    else {
        resolver.addError(node, `Can't infer Type.`);
    }
}
exports.visitVariableDeclarator = visitVariableDeclarator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGVEZWNsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9yZXNvbHZlci92YXJpYWJsZURlY2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsa0RBQXVEO0FBRXZELFNBQWdCLHVCQUF1QixDQUNyQyxRQUFrQixFQUNsQixJQUE0Qjs7SUFFNUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDNUMsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLElBQUksZUFBZSxHQUEyQixJQUFJLENBQUM7SUFDbkQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUV4QywwREFBMEQ7SUFDMUQsSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsRUFBRTtRQUM1Qix3Q0FBd0M7UUFDeEMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzdDLElBQUksVUFBVSxJQUFJLENBQUMsRUFBRTtZQUNuQixJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7Z0JBQ3BCLHlDQUF5QztnQkFDekMsSUFBSSxPQUFBLFFBQVEsQ0FBQyxlQUFlLDBDQUFFLElBQUksS0FBSSxZQUFZLEVBQUU7b0JBQ2xELHdEQUF3RDtvQkFDeEQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztpQkFDbEU7cUJBQU07b0JBQ0wsUUFBUSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDOUM7YUFDRjtpQkFBTSxJQUFJLFNBQVMsSUFBSSxJQUFJLEVBQUU7Z0JBQzVCLGdFQUFnRTtnQkFDaEUsSUFBSSxTQUFTLENBQUMsSUFBSSxJQUFJLE9BQU87b0JBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxTQUFT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