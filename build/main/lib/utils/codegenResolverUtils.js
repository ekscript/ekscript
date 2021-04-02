"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mirrorAnonNameInComplexTypes = exports.stitchFunctions = exports.isComparisionOperator = exports.compareVariableTypes = exports.getEnvValueRecursively = exports.matchLiteralType = void 0;
const matchLiteralType = (lit) => lit == 'int_literal' ||
    lit == 'bigint_literal' ||
    lit == 'float_literal' ||
    lit == 'int' ||
    lit == 'float' ||
    lit == 'boolean' ||
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
    let arr = [];
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
                    typeof des.subTypes[0] != 'string') {
                    const res = mirrorAnonNameInComplexTypes(src.subTypes[0], des.subTypes[0]);
                    arr = [...arr, ...res];
                }
            }
        }
    }
    return arr;
}
exports.mirrorAnonNameInComplexTypes = mirrorAnonNameInComplexTypes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWdlblJlc29sdmVyVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3V0aWxzL2NvZGVnZW5SZXNvbHZlclV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVNPLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUM5QyxHQUFHLElBQUksYUFBYTtJQUNwQixHQUFHLElBQUksZ0JBQWdCO0lBQ3ZCLEdBQUcsSUFBSSxlQUFlO0lBQ3RCLEdBQUcsSUFBSSxLQUFLO0lBQ1osR0FBRyxJQUFJLE9BQU87SUFDZCxHQUFHLElBQUksU0FBUztJQUNoQixHQUFHLElBQUksTUFBTTtJQUNiLEdBQUcsSUFBSSxRQUFRO0lBQ2YsR0FBRyxJQUFJLE1BQU07SUFDYixHQUFHLElBQUksTUFBTTtJQUNiLEdBQUcsSUFBSSxPQUFPLENBQUM7QUFYSixRQUFBLGdCQUFnQixvQkFXWjtBQUVqQjs7OztLQUlLO0FBQ0wsU0FBZ0Isc0JBQXNCLENBQ3BDLGNBQXNCLEVBQ3RCLElBQWdCOztJQUVoQixJQUFJLElBQUksSUFBSSxJQUFJO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDOUIsSUFDRSxJQUFJLENBQUMsSUFBSSxJQUFJLGlCQUFpQjtRQUM5QixJQUFJLENBQUMsSUFBSSxJQUFJLFNBQVM7UUFDdEIsSUFBSSxDQUFDLElBQUksSUFBSSxlQUFlO1FBQzVCLElBQUksQ0FBQyxJQUFJLElBQUksYUFBYSxFQUMxQjtRQUNBLE1BQU0sTUFBTSxTQUFJLElBQXVCLDBDQUFFLEdBQUcsQ0FBQztRQUM3QyxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDbEMsT0FBTyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDL0I7UUFDRCxPQUFPLHNCQUFzQixDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsTUFBTyxDQUFDLENBQUM7S0FDN0Q7SUFDRCxPQUFPLHNCQUFzQixD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