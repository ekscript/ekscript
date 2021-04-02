"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const fileOps_1 = require("../utils/fileOps");
const compiler_1 = __importDefault(require("../compiler"));
const getResolvedCode = (code) => {
    const compiler = new compiler_1.default({
        filePath: '',
        fileContent: code,
    });
    return compiler.parse().resolve();
};
const getCompiledCode = (compiler) => {
    return compiler.generateCode();
};
const getFileCodes = (fileName) => {
    const resolvedCompiler = getResolvedCode(fileOps_1.getFile(`./testFiles/${fileName}.ek`));
    const genCode = getCompiledCode(resolvedCompiler);
    const cFile = fileOps_1.getFile(`./testFiles/${fileName}.c`);
    return [genCode, cFile];
};
ava_1.default.todo('placeholder');
// test('Test empty code', (t) => {
//   t.is(
//     getCompiledCode(getResolvedCode('')),
//     '\nint main(int argc, char **argv) {\n  return 0 ;\n}\n'
//   );
// });
// test('Basic expressions & literals - I', (t) => {
//   const [genCode, cFile] = getFileCodes('basicexprlit1');
//   t.is(genCode, cFile);
// });
// test('While, For, Switch', (t) => {
//   const [genCode, cFile] = getFileCodes('02_while_switch_for');
//   t.is(genCode, cFile);
// });
ava_1.default('Array Codegen', (t) => {
    const [genCode, cFile] = getFileCodes('03_arrays');
    t.is(genCode, cFile);
});
// test('Objects', (t) => {
//   const [genCode, cFile] = getFileCodes('04_objects');
//   t.is(genCode, cFile);
// });
// test('Type definition Test', (t) => {
//   const [genCode, cFile] = getFileCodes('05_typedef');
//   t.is(genCode, cFile);
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvY29kZWdlbi9pbmRleC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLDhDQUEyQztBQUMzQywyREFBbUM7QUFFbkMsTUFBTSxlQUFlLEdBQUcsQ0FBQyxJQUFZLEVBQVksRUFBRTtJQUNqRCxNQUFNLFFBQVEsR0FBRyxJQUFJLGtCQUFRLENBQUM7UUFDNUIsUUFBUSxFQUFFLEVBQUU7UUFDWixXQUFXLEVBQUUsSUFBSTtLQUNsQixDQUFDLENBQUM7SUFDSCxPQUFPLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQyxDQUFDLENBQUM7QUFFRixNQUFNLGVBQWUsR0FBRyxDQUFDLFFBQWtCLEVBQVUsRUFBRTtJQUNyRCxPQUFPLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNqQyxDQUFDLENBQUM7QUFFRixNQUFNLFlBQVksR0FBRyxDQUFDLFFBQWdCLEVBQTRCLEVBQUU7SUFDbEUsTUFBTSxnQkFBZ0IsR0FBRyxlQUFlLENBQ3RDLGlCQUFPLENBQUMsZUFBZSxRQUFRLEtBQUssQ0FBQyxDQUN0QyxDQUFDO0lBQ0YsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDbEQsTUFBTSxLQUFLLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLFFBQVEsSUFBSSxDQUFDLENBQUM7SUFDbkQsT0FBTyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxQixDQUFDLENBQUM7QUFFRixhQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRXpCLG1DQUFtQztBQUNuQyxVQUFVO0FBQ1YsNENBQTRDO0FBQzVDLCtEQUErRDtBQUMvRCxPQUFPO0FBQ1AsTUFBTTtBQUVOLG9EQUFvRDtBQUNwRCw0REFBNEQ7QUFDNUQsMEJBQTBCO0FBQzFCLE1BQU07QUFFTixzQ0FBc0M7QUFDdEMsa0VBQWtFO0FBQ2xFLDBCQUEwQjtBQUMxQixNQUFNO0FBRU4sYUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQzFCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0FBRUgsMkJBQTJCO0FBQzNCLHlEQUF5RDtBQUN6RCwwQkFBMEI7QUFDMUIsTUFBTTtBQUVOLHdDQUF3QztBQUN4Qyx5REFBeUQ7QUFDekQsMEJBQTBCO0FBQzFCLE1BQU0ifQ==