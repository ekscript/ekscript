import { IdentifierNode, SubVariableType, SyntaxNode } from 'tree-sitter-ekscript';
import { FuncGenType } from '../../types/compiler';
export declare const matchLiteralType: (lit: string) => boolean;
/**
 * Get the { type, kind: VarKind } for an identifier WRT environments
 * @param identifierName    name of the identifier to find
 * @param node              parent node of the identifier
 * */
export declare function getEnvValueRecursively(identifierName: string, node: SyntaxNode): IdentifierNode | null;
/**
 * compare variable types w.r.t. to two variableTypes and subVariableType
 * */
export declare function compareVariableTypes(varTypeA: string, subVarTypeA: SubVariableType | null, varTypeB: string, subVarTypeB: SubVariableType | null, ignoreEmptyArraysSubVarTypeB?: boolean): boolean;
export declare const isComparisionOperator: (op: string) => boolean;
export declare function stitchFunctions(functions: FuncGenType[]): string;
/**
 * @return Array of duplicate typeAlias in the mirroring process
 * */
export declare function mirrorAnonNameInComplexTypes(src: SubVariableType, des: SubVariableType): string[];
