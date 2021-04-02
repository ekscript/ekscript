"use strict";
/**
 * ====================
 * Compiler class
 * ====================
 * A class that manages the whole compilation process
 * */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCompilerBackendType = void 0;
const fileOps_1 = require("../utils/fileOps");
const codegen_1 = __importDefault(require("../codegen"));
const parser_1 = __importDefault(require("../parser"));
const resolver_1 = __importDefault(require("../resolver"));
const errorHandler_1 = require("./errorHandler");
// --------------------------------------
var TCompilerBackendType;
(function (TCompilerBackendType) {
    TCompilerBackendType[TCompilerBackendType["JS"] = 0] = "JS";
    TCompilerBackendType[TCompilerBackendType["C"] = 1] = "C";
})(TCompilerBackendType = exports.TCompilerBackendType || (exports.TCompilerBackendType = {}));
class Compiler {
    constructor(entry, sources = [], backend = TCompilerBackendType.C, outputFile = 'a.out') {
        this.backend = backend;
        this.outputFile = outputFile;
        this.output = '';
        this.errors = [];
        this.warnings = [];
        this._tree = null;
        this.generators = {};
        this.parser = new parser_1.default(entry, sources, this.errors, this.warnings);
        if (!outputFile)
            this.outputFile = entry.filePath.slice(0, entry.filePath.length - 3);
    }
    parse() {
        this._tree = this.parser.parse();
        return this;
    }
    printErrorsWarnings() {
        errorHandler_1.printErrors(this.errors);
        errorHandler_1.printWarnings(this.warnings);
    }
    resolve() {
        var _a;
        this.generators = new resolver_1.default(this.tree, this.errors, this.warnings).visit((_a = this.tree) === null || _a === void 0 ? void 0 : _a.rootNode).generators;
        // printWarnings(this.warnings);
        if (this.errors.length) {
            // printErrors(this.errors);
            throw new Error(JSON.stringify(this.errors));
        }
        return this;
    }
    get tree() {
        return this._tree;
    }
    generateCode(tree) {
        const codegen = new codegen_1.default(tree !== null && tree !== void 0 ? tree : this.tree, this.errors, this.warnings, this.generators);
        this.output = codegen.compileToC();
        return this.output;
    }
    generateCodeToOutput() {
        fileOps_1.setFile(this.backend == TCompilerBackendType.C ? 'a.c' : this.outputFile, this.output);
    }
    compileToExe() {
        if (this.backend == TCompilerBackendType.C) {
            // exec(`gcc ${this.outputfile} -o -O0 a.out`);
        }
        else {
            console.error('Not possible to convert JS target to exe');
        }
    }
}
exports.default = Compiler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NvbXBpbGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7S0FLSzs7Ozs7O0FBTUwsOENBQTJDO0FBQzNDLHlEQUFpQztBQUNqQyx1REFBK0I7QUFDL0IsMkRBQW1DO0FBRW5DLGlEQUE0RDtBQUU1RCx5Q0FBeUM7QUFDekMsSUFBWSxvQkFHWDtBQUhELFdBQVksb0JBQW9CO0lBQzlCLDJEQUFFLENBQUE7SUFDRix5REFBQyxDQUFBO0FBQ0gsQ0FBQyxFQUhXLG9CQUFvQixHQUFwQiw0QkFBb0IsS0FBcEIsNEJBQW9CLFFBRy9CO0FBRUQsTUFBcUIsUUFBUTtJQVczQixZQUNFLEtBQXNCLEVBQ3RCLFVBQTZCLEVBQUUsRUFDdkIsVUFBVSxvQkFBb0IsQ0FBQyxDQUFDLEVBQ2hDLGFBQXFCLE9BQU87UUFENUIsWUFBTyxHQUFQLE9BQU8sQ0FBeUI7UUFDaEMsZUFBVSxHQUFWLFVBQVUsQ0FBa0I7UUFiOUIsV0FBTSxHQUFHLEVBQUUsQ0FBQztRQUVwQixXQUFNLEdBQXFCLEVBQUUsQ0FBQztRQUM5QixhQUFRLEdBQXFCLEVBQUUsQ0FBQztRQUV4QixVQUFLLEdBQWdCLElBQUksQ0FBQztRQUUxQixlQUFVLEdBQW9DLEVBQUUsQ0FBQztRQVF2RCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxVQUFVO1lBQ2IsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFVLENBQUM7UUFDekMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsbUJBQW1CO1FBQ2pCLDBCQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pCLDRCQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxPQUFPOztRQUNMLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxrQkFBUSxDQUM1QixJQUFJLENBQUMsSUFBSyxFQUNWLElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FDZCxDQUFDLEtBQUssQ0FBQyxNQUFBLElBQUksQ0FBQyxJQUFJLDBDQUFFLFFBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUV6QyxnQ0FBZ0M7UUFDaEMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUN0Qiw0QkFBNEI7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQzlDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFHRCxZQUFZLENBQUMsSUFBVztRQUN0QixNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQ3pCLElBQUksYUFBSixJQUFJLGNBQUosSUFBSSxHQUFJLElBQUksQ0FBQyxJQUFLLEVBQ2xCLElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsVUFBVSxDQUNoQixDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbkMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxvQkFBb0I7UUFDbEIsaUJBQU8sQ0FDTCxJQUFJLENBQUMsT0FBTyxJQUFJLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUNoRSxJQUFJLENBQUMsTUFBTSxDQUNaLENBQUM7SUFDSixDQUFDO0lBRUQsWUFBWTtRQUNWLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxDQUFDLEVBQUU7WUFDMUMsK0NBQStDO1NBQ2hEO2FBQU07WUFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7U0FDM0Q7SUFDSCxDQUFDO0NBQ0Y7QUE3RUQsMkJBNkVDIn0=