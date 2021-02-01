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
// ------------- Type Imports -------------
import TSParser from 'tree-sitter';
import TSEk from 'tree-sitter-ekscript';

import { TCompilerError, TCompilerSource } from '../../types/compiler';
import { getFile } from '../../utils/fileOps';
import { TCompilerErrorType } from '../compiler/errorHandler';

// ----------------------------------------

export default class Parser {
  private parser: TSParser;
  private _typeTree: { rootNode: string };

  constructor(
    private entry: TCompilerSource,
    private sources: TCompilerSource[] = [],
    private errors: TCompilerError[] = [],
    private warnings: TCompilerError[] = []
  ) {
    this.parser = new TSParser();
    this.parser.setLanguage(TSEk);
    this._typeTree = { rootNode: '' };
  }

  parse() {
    return this.parser.parse(this.entry.fileContent);
  }

  get typeTree() {
    return this._typeTree;
  }

  readModule(filePath: string) {
    try {
      const file = getFile(filePath);
      return file;
    } catch (e) {
      const fileInSources = this.sources.find(
        (source) => source.filePath == filePath
      )?.fileContent;
      if (fileInSources) {
        return fileInSources;
      }
      this.errors.push({
        line: 0,
        pos: 0,
        errorMessage: 'Cannot find module' + filePath,
        errorType: TCompilerErrorType.COMPILE_ERROR,
      });
      return '';
    }
  }

  addError(mes: string) {
    this.errors.push({
      line: 0,
      pos: 0,
      errorMessage: mes,
      errorType: TCompilerErrorType.COMPILE_ERROR,
    });
  }

  addWarning(mes: string) {
    this.warnings.push({
      line: 0,
      pos: 0,
      errorMessage: mes,
      errorType: TCompilerErrorType.COMPILE_ERROR,
    });
  }
}
