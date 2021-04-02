"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mirrorAnonNameInComplexTypes = exports.stitchFunctions = exports.isComparisionOperator = exports.compareVariableTypes = exports.getEnvValueRecursively = exports.matchLiteralType = void 0;
const matchLiteralType = (lit) => lit == 'int_literal' ||
    lit == 'bigint_literal' ||
    lit == 'float_literal' ||
    lit == 'char' ||
    lit == 'string' ||
    lit == 'null' ||
    lit == 'true' ||
    lit == 'false';
exports.matchLiteralType = matchLiteralType;
/**
 * Get the { type, kind: VarKind } for an identifier WRT environments
 * @param identifierName    name of the identifier to find
 * @param node              parent node of the identifier
 * */
function getEnvValueRecursively(identifierName, node) {
    var _a;
    if (node == null)
        return null;
    if (node.type == 'statement_block' ||
        node.type == 'program' ||
        node.type == 'for_statement' ||
        node.type == 'else_clause') {
        const theEnv = (_a = node) === null || _a === void 0 ? void 0 : _a.env;
        if (theEnv[identifierName] != null) {
            return theEnv[identifierName];
        }
        return getEnvValueRecursively(identifierName, node.parent);
    }
    return getEnvValueRecursively(identifierName, node.parent);
}
exports.getEnvValueRecursively = getEnvValueRecursively;
/**
 * compare variable types w.r.t. to two variableTypes and subVariableType
 * */
function compareVariableTypes(varTypeA, subVarTypeA, varTypeB, subVarTypeB, ignoreEmptyArraysSubVarTypeB = true) {
    if (varTypeA == varTypeB) {
        if (varTypeA == 'array') {
            if (subVarTypeA && subVarTypeB) {
                if (subVarTypeA.subTypes && subVarTypeB.subTypes) {
                    if (subVarTypeA.subTypes.length == subVarTypeB.subTypes.length) {
                        for (let i = 0; i < subVarTypeA.subTypes.length; i++) {
                            const subTypeA = subVarTypeA.subTypes[i];
                            const subTypeB = subVarTypeB.subTypes[i];
                            if (typeof subTypeA == 'string' && typeof subTypeB == 'string') {
                                return subTypeA == subTypeB;
                            }
                            else if (typeof subTypeA == 'string' ||
                                typeof subTypeB == 'string') {
                                return false;
                            }
                            if (!compareVariableTypes(subTypeA.variableType, subTypeA, subTypeB.variableType, subTypeB))
                                return false;
                        }
                        return true;
                    }
                }
                return false;
            }
            if (ignoreEmptyArraysSubVarTypeB && subVarTypeA && subVarTypeB == null)
                return true;
            return false;
        }
        if (varTypeA == 'object') {
            if (subVarTypeA && subVarTypeB) {
                if (subVarTypeA.fields && subVarTypeB.fields) {
                    const keysA = Object.keys(subVarTypeA.fields);
                    const keysB = Object.keys(subVarTypeB.fields);
                    if (keysA.length == keysB.length) {
                        for (let i = 0; i < keysA.length; i++) {
                            const keyA = keysA[i];
                            const valueA = subVarTypeA.fields[keyA];
                            const valueB = subVarTypeB.fields[keyA];
                            if (valueA && valueB) {
                                if (typeof valueA == 'string' || typeof valueB == 'string') {
                                    if (typeof valueA == 'string' && typeof valueB == 'string') {
                                        if (valueA != valueB)
                                            return false;
                                    }
                                }
                                else {
                                    if (!compareVariableTypes(valueA.variableType, valueA, valueB.variableType, valueB))
                                        return false;
                                }
                            }
                        }
                        return true;
                    }
                }
            }
            return false;
        }
        return true;
    }
    return false;
}
exports.compareVariableTypes = compareVariableTypes;
const isComparisionOperator = (op) => op == '==' ||
    op == '!=' ||
    op == '<=' ||
    op == '>=' ||
    op == '<' ||
    op == '>' ||
    op == '&&' ||
    op == '||';
exports.isComparisionOperator = isComparisionOperator;
function stitchFunctions(functions) {
    let finalString = '';
    for (const func of functions) {
        const { returnType, name, funcArgs, body, destructors } = func;
        finalString += `${returnType} ${name}(${funcArgs
            .map((a) => a.join(' '))
            .join(', ')}) {
${body.join('\n')}${destructors.length ? '\n' : ''}${destructors.join('\n')}
}
`;
    }
    return finalString;
}
exports.stitchFunctions = stitchFunctions;
/**
 * @return Array of duplicate typeAlias in the mirroring process
 * */
function mirrorAnonNameInComplexTypes(src, des) {
    const arr = [];
    if (src && des) {
        if (src.variableType == 'object') {
            if (src.typeAlias)
                des.typeAlias = src.typeAlias;
            for (const key in src.fields) {
                const srcVal = src.fields[key];
                let desVal = null;
                if (des.fields)
                    desVal = des.fields[key];
                if (typeof srcVal != 'string' && typeof desVal != 'string') {
                    if (desVal)
                        mirrorAnonNameInComplexTypes(srcVal, desVal);
                }
            }
        }
        else if (src.variableType == 'array') {
            if (src.typeAlias) {
                // if des.typeAlias is already present, replace it
                // with the one already present
                if (des.typeAlias)
                    arr.push(des.typeAlias);
                des.typeAlias = src.typeAlias;
            }
            if (src.subTypes && des.subTypes) {
                if (typeof src.subTypes[0] != 'string' &&
                    typeof des.subTypes[0] != 'string')
                    mirrorAnonNameInComplexTypes(src.subTypes[0], des.subTypes[0]);
            }
        }
    }
    return arr;
}
exports.mirrorAnonNameInComplexTypes = mirrorAnonNameInComplexTypes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWdlblJlc29sdmVyVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvY29kZWdlblJlc29sdmVyVXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBU08sTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFLENBQzlDLEdBQUcsSUFBSSxhQUFhO0lBQ3BCLEdBQUcsSUFBSSxnQkFBZ0I7SUFDdkIsR0FBRyxJQUFJLGVBQWU7SUFDdEIsR0FBRyxJQUFJLE1BQU07SUFDYixHQUFHLElBQUksUUFBUTtJQUNmLEdBQUcsSUFBSSxNQUFNO0lBQ2IsR0FBRyxJQUFJLE1BQU07SUFDYixHQUFHLElBQUksT0FBTyxDQUFDO0FBUkosUUFBQSxnQkFBZ0Isb0JBUVo7QUFFakI7Ozs7S0FJSztBQUNMLFNBQWdCLHNCQUFzQixDQUNwQyxjQUFzQixFQUN0QixJQUFnQjs7SUFFaEIsSUFBSSxJQUFJLElBQUksSUFBSTtRQUFFLE9BQU8sSUFBSSxDQUFDO0lBQzlCLElBQ0UsSUFBSSxDQUFDLElBQUksSUFBSSxpQkFBaUI7UUFDOUIsSUFBSSxDQUFDLElBQUksSUFBSSxTQUFTO1FBQ3RCLElBQUksQ0FBQyxJQUFJLElBQUksZUFBZTtRQUM1QixJQUFJLENBQUMsSUFBSSxJQUFJLGFBQWEsRUFDMUI7UUFDQSxNQUFNLE1BQU0sU0FBSSxJQUF1QiwwQ0FBRSxHQUFHLENBQUM7UUFDN0MsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksSUFBSSxFQUFFO1lBQ2xDLE9BQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsT0FBTyxzQkFBc0IsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLE1BQU8sQ0FBQyxDQUFDO0tBQzdEO0lBQ0QsT0FBTyxzQkFBc0IsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLE1BQU8sQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFsQkQsd0RBa0JDO0FBRUQ7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