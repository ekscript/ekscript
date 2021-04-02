"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const tree_sitter_1 = __importDefault(require("tree-sitter"));
const tree_sitter_ekscript_1 = __importDefault(require("tree-sitter-ekscript"));
const fileOps_1 = require("../utils/fileOps");
const errorHandler_1 = require("../compiler/errorHandler");
// ----------------------------------------
class Parser {
    constructor(entry, sources = [], errors = [], warnings = []) {
        this.entry = entry;
        this.sources = sources;
        this.errors = errors;
        this.warnings = warnings;
        this.tsParser = new tree_sitter_1.default();
        this.tsParser.setLanguage(tree_sitter_ekscript_1.default);
        this._typeTree = { rootNode: '' };
    }
    parse() {
        return this.tsParser.parse(this.entry.fileContent);
    }
    get typeTree() {
        return this._typeTree;
    }
    readModule(filePath) {
        var _a;
        try {
            const file = fileOps_1.getFile(filePath);
            return file;
        }
        catch (e) {
            const fileInSources = (_a = this.sources.find((source) => source.filePath == filePath)) === null || _a === void 0 ? void 0 : _a.fileContent;
            if (fileInSources) {
                return fileInSources;
            }
            this.errors.push({
                line: 0,
                pos: 0,
                errorMessage: 'Cannot find module' + filePath,
                errorType: errorHandler_1.TCompilerErrorType.COMPILE_ERROR,
            });
            return '';
        }
    }
    addError(mes) {
        this.errors.push({
            line: 0,
            pos: 0,
            errorMessage: mes,
            errorType: errorHandler_1.TCompilerErrorType.COMPILE_ERROR,
        });
    }
    addWarning(mes) {
        this.warnings.push({
            line: 0,
            pos: 0,
            errorMessage: mes,
            errorType: errorHandler_1.TCompilerErrorType.COMPILE_ERROR,
        });
    }
}
exports.default = Parser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3BhcnNlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBOzs7Ozs7Ozs7OztLQVdLO0FBQ0wsMkNBQTJDO0FBQzNDLDhEQUFtQztBQUNuQyxnRkFBd0M7QUFHeEMsOENBQTJDO0FBQzNDLDJEQUE4RDtBQUU5RCwyQ0FBMkM7QUFFM0MsTUFBcUIsTUFBTTtJQUl6QixZQUNVLEtBQXNCLEVBQ3RCLFVBQTZCLEVBQUUsRUFDL0IsU0FBMkIsRUFBRSxFQUM3QixXQUE2QixFQUFFO1FBSC9CLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBQ3RCLFlBQU8sR0FBUCxPQUFPLENBQXdCO1FBQy9CLFdBQU0sR0FBTixNQUFNLENBQXVCO1FBQzdCLGFBQVEsR0FBUixRQUFRLENBQXVCO1FBRXZDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxxQkFBUSxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsOEJBQUksQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVELEtBQUs7UUFDSCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBRUQsVUFBVSxDQUFDLFFBQWdCOztRQUN6QixJQUFJO1lBQ0YsTUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQixPQUFPLElBQUksQ0FBQztTQUNiO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixNQUFNLGFBQWEsU0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FDckMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksUUFBUSxDQUN4QywwQ0FBRSxXQUFXLENBQUM7WUFDZixJQUFJLGFBQWEsRUFBRTtnQkFDakIsT0FBTyxhQUFhLENBQUM7YUFDdEI7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDZixJQUFJLEVBQUUsQ0FBQztnQkFDUCxHQUFHLEVBQUUsQ0FBQztnQkFDTixZQUFZLEVBQUUsb0JBQW9CLEdBQUcsUUFBUTtnQkFDN0MsU0FBUyxFQUFFLGlDQUFrQixDQUFDLGFBQWE7YUFDNUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxFQUFFLENBQUM7U0FDWDtJQUNILENBQUM7SUFFRCxRQUFRLENBQUMsR0FBVztRQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLElBQUksRUFBRSxDQUFDO1lBQ1AsR0FBRyxFQUFFLENBQUM7WUFDTixZQUFZLEVBQUUsR0FBRztZQUNqQixTQUFTLEVBQUUsaUNBQWtCLENBQUMsYUFBYTtTQUM1QyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsVUFBVSxDQUFDLEdBQVc7UUFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDakIsSUFBSSxFQUFFLENBQUM7WUFDUCxHQUFHLEVBQUUsQ0FBQztZQUNOLFlBQVksRUFBRSxHQUFHO1lBQ2pCLFNBQVMsRUFBRSxpQ0FBa0IsQ0FBQyxhQUFhO1NBQzVDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTdERCx5QkE2REMifQ==