/**
 * ==============
 * Parser
 * ==============
 * This file works in the following steps
 *
 * 1. Create an AST using tree-sitter
 *    1.1. Add all the errors, warnings out there from tree-sitter
 * 2. Walk through the AST for a semantic check
 *    2.1. First do general JS like semantic check
 *    2.2. Type checking and simplification of types
 * */
import TSParser from 'tree-sitter';
import { TCompilerError, TCompilerSource } from '../../types/compiler';
export default class Parser {
    private entry;
    private sources;
    private errors;
    private warnings;
    tsParser: TSParser;
    private _typeTree;
    constructor(entry: TCompilerSource, sources?: TCompilerSource[], errors?: TCompilerError[], warnings?: TCompilerError[]);
    parse(): TSParser.Tree;
    get typeTree(): {
        rootNode: string;
    };
    readModule(filePath: string): string;
    addError(mes: string): void;
    addWarning(mes: string): void;
}
