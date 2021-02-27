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
  subVarTypeB: SubVariableType | null
): boolean {
  /* a util function that is not bound to be used outside of this function therefore declared here. */
  const compareSubVarType = (
    s1: SubVariableType | null,
    s2: SubVariableType | null
  ) => {
    if (s1 == null || s2 == null) return false;
    return JSON.stringify(s1) == JSON.stringify(s2);
  };

  if (varTypeA == varTypeB) {
    if (varTypeA == 'array')
      return compareSubVarType(subVarTypeA!, subVarTypeB!);
    if (varTypeA == 'object') {
      for (const key in subVarTypeA!.fields!) {
        const value = subVarTypeA?.fields ? subVarTypeA?.fields[key] : null;
        const sVTBF = subVarTypeB?.fields ? subVarTypeB?.fields[key] : null;
        if (sVTBF == null) return false;
        if (typeof value == 'string') {
          if (typeof sVTBF != 'string' || sVTBF != value) return false;
        } else {
          if (!compareVariableTypes(key, value, key, sVTBF as SubVariableType))
            return false;
        }
      }
      return true;
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
