import { SubVariableType } from 'tree-sitter-ekscript';
export declare function genMain(statements: string[]): string;
export declare function genFunc(name: string, statements: string[], args: Record<string, [argType: string, defaultVal: string | null]>, returnType: string, isGlobal?: boolean): string;
export declare function genStruct(name: string, fields: Record<string, string | SubVariableType>): string;
export declare function genEnum(name: string, fields: Record<string, string | null>): string;
export declare function generateArrayUtils(arrType: string, subType: string): string;
/**
 * Generate object, initializer, destructor etc
 * TODO: add support for array types
 * */
export declare function generateObjectUtils(objectName: string, objType: SubVariableType): string;
export declare function generateTypeDefs(name: string): string;
export declare function generateFromGenerators(generators: Record<string, SubVariableType>): string;
