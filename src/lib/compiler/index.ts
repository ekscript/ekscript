/**
 * ====================
 * Compiler class
 * ====================
 * A class that manages the whole compilation process
 * */

import { Tree } from 'tree-sitter-ekscript';

// ------------- Regular Imports ---------
import { TCompilerError, TCompilerSource } from '../../types/compiler';
import { setFile } from '../../utils/fileOps';
import CodeGen from '../codegen';
import Parser from '../parser';
import Resolver from '../resolver';

import { printErrors, printWarnings } from './errorHandler';

// --------------------------------------
export enum TCompilerBackendType {
  JS,
  C,
}

export default class Compiler {
  private parser: Parser;
  private output = '';

  private errors: TCompilerError[] = [];
  private warnings: TCompilerError[] = [];

  private _tree: Tree | null = null;

  constructor(
    entry: TCompilerSource,
    sources: TCompilerSource[] = [],
    private backend = TCompilerBackendType.C,
    private outputFile: string = 'a.out'
  ) {
    this.parser = new Parser(entry, sources, this.errors, this.warnings);
    if (!outputFile)
      this.outputFile = entry.filePath.slice(0, entry.filePath.length - 3);
  }

  parse() {
    this._tree = this.parser.parse() as Tree;
    return this;
  }

  printErrorsWarnings() {
    printErrors(this.errors);
    printWarnings(this.warnings);
  }

  resolve() {
    new Resolver(this.tree!, this.errors, this.warnings).visit();
    // printWarnings(this.warnings);
    if (this.errors.length) {
      // printErrors(this.errors);
      throw new Error('Compilation Failed');
    }
    return this;
  }

  get tree() {
    return this._tree;
  }

  generateCode(tree?: Tree): string {
    const codegen = new CodeGen(tree ?? this.tree!, this.errors, this.warnings);
    this.output = codegen.compileToC();
    return this.output;
  }

  generateCodeToOutput() {
    setFile(
      this.backend == TCompilerBackendType.C ? 'a.c' : this.outputFile,
      this.output
    );
  }

  compileToExe() {
    if (this.backend == TCompilerBackendType.C) {
      // exec(`gcc ${this.outputfile} -o -O0 a.out`);
    } else {
      console.error('Not possible to convert JS target to exe');
    }
  }
}
