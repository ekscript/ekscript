import {
  IdentifierNode,
  StatementBlockNode,
  SubVariableType,
  SyntaxNode,
} from 'tree-sitter-ekscript';

import { FuncGenType } from '../types/compiler';

export const matchLiteralType = (lit: string) =>
  lit == 'int_literal' ||
  lit == 'bigint_literal' ||
  lit == 'float_literal' ||
  lit == 'char' ||
  lit == 'string' ||
  lit == 'null' ||
  lit == 'true' ||
  lit == 'false';

/**
 * Get the { type, kind: VarKind } for an identifier WRT environments
 * @param identifierName    name of the identifier to find
 * @param node              parent node of the identifier
 * */
export function getEnvValueRecursively(
  identifierName: string,
  node: SyntaxNode
): IdentifierNode | null {
  if (node == null) return null;
  if (
    node!.type == 'statement_block' ||
    node!.type == 'program' ||
    node.type == 'for_statement'
  ) {
    const theEnv = (node as StatementBlockNode)?.env;
    if (theEnv[identifierName] != null) {
      return theEnv[identifierName];
    }
    return getEnvValueRecursively(identifierName, node.parent!);
  }
  return getEnvValueRecursively(identifierName, node.parent!);
}

/**
 * compare variable types w.r.t. to two variableTypes and subVariableType
 * */
export function compareVariableTypes(
  varTypeA: string,
  subVarTypeA: SubVariableType | null,
  varTypeB: string,
  subVarTypeB: SubVariableType | null,
  ignoreEmptyArraysSubVarTypeB = true
): boolean {
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
              } else if (
                typeof subTypeA == 'string' ||
                typeof subTypeB == 'string'
              ) {
                return false;
              }

              if (
                !compareVariableTypes(
                  subTypeA.variableType,
                  subTypeA,
                  subTypeB.variableType,
                  subTypeB
                )
              )
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
                    if (valueA != valueB) return false;
                  }
                } else {
                  if (
                    !compareVariableTypes(
                      valueA.variableType,
                      valueA,
                      valueB.variableType,
                      valueB
                    )
                  )
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

export const isComparisionOperator = (op: string) =>
  op == '==' ||
  op == '!=' ||
  op == '<=' ||
  op == '>=' ||
  op == '<' ||
  op == '>' ||
  op == '&&' ||
  op == '||';

export function stitchFunctions(functions: FuncGenType[]): string {
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

/**
 * @return Array of duplicate typeAlias in the mirroring process
 * */
export function mirrorAnonNameInComplexTypes(
  src: SubVariableType,
  des: SubVariableType
): string[] {
  const arr: string[] = [];
  if (src && des) {
    if (src.variableType == 'object') {
      if (src.typeAlias) des.typeAlias = src.typeAlias;

      for (const key in src.fields) {
        const srcVal = src.fields[key];
        let desVal = null;
        if (des.fields) desVal = des.fields[key];
        if (typeof srcVal != 'string' && typeof desVal != 'string') {
          if (desVal) mirrorAnonNameInComplexTypes(srcVal, desVal!);
        }
      }
    } else if (src.variableType == 'array') {
      if (src.typeAlias) {
        // if des.typeAlias is already present, replace it
        // with the one already present
        if (des.typeAlias) arr.push(des.typeAlias);
        des.typeAlias = src.typeAlias;
      }
      if (src.subTypes && des.subTypes) {
        if (
          typeof src.subTypes[0] != 'string' &&
          typeof des.subTypes[0] != 'string'
        )
          mirrorAnonNameInComplexTypes(src.subTypes[0], des.subTypes[0]);
      }
    }
  }
  return arr;
}
