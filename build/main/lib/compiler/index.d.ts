/**
 * ====================
 * Compiler class
 * ====================
 * A class that manages the whole compilation process
 * */
import { Tree } from 'tree-sitter-ekscript';
import { TCompilerError, TCompilerSource } from '../../types/compiler';
export declare enum TCompilerBackendType {
    JS = 0,
    C = 1
}
export default class Compiler {
    private backend;
    private outputFile;
    private parser;
    private output;
    errors: TCompilerError[];
    warnings: TCompilerError[];
    private _tree;
    private generators;
    constructor(entry: TCompilerSource, sources?: TCompilerSource[], backend?: TCompilerBackendType, outputFile?: string);
    parse(): this;
    printErrorsWarnings(): void;
    resolve(): this;
    get tree(): Tree | null;
    generateCode(tree?: Tree): string;
    generateCodeToOutput(): void;
    compileToExe(): void;
}
