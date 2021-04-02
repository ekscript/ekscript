"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const fileOps_1 = require("../utils/fileOps");
const compiler_1 = __importDefault(require("../compiler"));
require("ts-replace-all");
const getResolvedCode = (code) => {
    const compiler = new compiler_1.default({
        filePath: '',
        fileContent: code,
    });
    return compiler.parse().resolve();
};
const getResolvedAst = (code) => { var _a; return (_a = getResolvedCode(code).tree) === null || _a === void 0 ? void 0 : _a.rootNode.toString(); };
const cleanStr = (s) => s.replaceAll(/\s+/g, ' ').trim();
// @ts-ignore
const getFileCodes = (fileName) => {
    const genAst = getResolvedAst(fileOps_1.getFile(`./testFiles/tree-sitter-ast/${fileName}.ek`));
    const expectedAst = cleanStr(fileOps_1.getFile(`./testFiles/tree-sitter-ast/${fileName}.c`));
    return [genAst, expectedAst];
};
ava_1.default.todo('Some TODO tasks');
// test('Basic Expr - I', (t) => {
//   const [genAst, expectedAst] = getFileCodes('basicexpr1');
//   t.is(genAst, expectedAst);
// });
// test('LexicalDeclaration-I', (t) => {
//   const error = t.throws(() => {
//     getResolvedCode('let a;');
//   });
//   t.is(error.message, 'Compilation Failed');
//   const error2 = t.throws(() => {
//     getResolvedCode('const a = 1, c = "hello"; let d = \'i\', c = a;');
//   });
//   t.is(error2.message, 'Compilation Failed');
//   const error3 = t.throws(() => {
//     getResolvedCode('let a: string');
//   });
//   t.is(error3.message, 'Compilation Failed');
//   t.is(
//     getResolvedAst('let a: string = "", b = a;'),
//     cleanStr(`(program
//        (lexical_declaration
//          (variable_declarator
//            name: (identifier) type: (type_annotation (predefined_type)) value: (string))
//          (variable_declarator name: (identifier) value: (identifier))))`)
//   );
// });
// test('Binary expression-I', (t) => {
//   const error = t.throws(() => {
//     getResolvedCode('let a = 1; let b = "hello"; a + b;');
//   });
//   t.is(error.message, 'Compilation Failed');
//   t.is(
//     t.throws(() => {
//       getResolvedCode(`1n + 1; let a = 1n, b = "1n"; a + b;`);
//     }).message,
//     'Compilation Failed'
//   );
//   t.is(typeof getResolvedAst('let a = "hello"; let b = 1; a + b;'), 'string');
//   t.is(typeof getResolvedAst('1 ** 2;'), 'string');
//   t.is(typeof getResolvedAst('("hello" + 1) + (1.3 + 2)'), 'string');
// });
// test('Unary expression', (t) => {
//   const error = t.throws(() => {
//     getResolvedCode('!1');
//   });
//   t.is(error.message, 'Compilation Failed');
//   t.is(typeof getResolvedAst('!true'), 'string');
// });
// test('Assignment Expressions', (t) => {
//   const error = t.throws(() => {
//     getResolvedCode('let a = 1; a = "hello";');
//   });
//   t.is(error.message, 'Compilation Failed');
// });
// test('if-else-if', (t) => {
//   const error = t.throws(() => {
//     getResolvedCode(`
//        let a = 1;
//        if (a == 1) { let b = 4; }
//        else if (a == 2) { b = 3; }
//        else {}`);
//   });
//   t.is(error.message, 'Compilation Failed');
// });
// test('while-simple_for', (t) => {
//   t.is(
//     typeof getResolvedAst(`let a = 10; while (a <= 4) a = a - 1 ;`),
//     'string'
//   );
//   // t.is(
//   //   typeof getResolvedAst(
//   //     `let j = 2;
//   //     for(let i = 0; i < 10, j < 2; i = i + 1) {
//   //       i = i + 1;
//   //     }`
//   //   ),
//   //   'string'
//   // );
//   // t.is(
//   //   typeof getResolvedAst(
//   //     `let j = 2;
//   //     for(let i = 0; i < 10, j < 2; i = i + 1) {
//   //       i = i + 1;
//   //     }`
//   //   ),
//   //   'string'
//   // );
// });
// test('switch-case-default', (t) => {
//   t.is(
//     t.throws(() => {
//       getResolvedCode(`let a = "hello";
//      switch(a) {
//        case "yo":
//        case "a": break;
//        case 1: break;
//        case "b": break;
//        default: break;
//      }`);
//     }).message,
//     'Compilation Failed'
//   );
// });
// test('arrays', (t) => {
//   // t.is(typeof getResolvedAst(`let a = [1]`), 'string');
//   // t.is(typeof getResolvedAst(`let a = [[1]]`), 'string');
//   // t.is(
//   //   typeof getResolvedAst(
//   //     `let i:string[]=["string"];
//   //   let b=""; let a:string[]=["Hello",b];
//   //   `
//   //   ),
//   //   'string'
//   // );
//   // t.is(
//   //   typeof getResolvedAst(`let b = [""];let a: string[][] = [b];`),
//   //   'string'
//   // );
//   // t.is(
//   //   typeof getResolvedAst(
//   //     `let a = ["str"]; let b: string[][] = [a, ["hello world"]];`
//   //   ),
//   //   'string'
//   // );
// });
// test('objects', (t) => {
//   t.is(typeof getResolvedAst('let a = { hello: { yo: "world" } }'), 'string');
//   t.is(
//     typeof getResolvedAst(
//       `let a = { hello: "y", a: 1 }; let b = { hello: "yo", a: 4 }; b = a;`
//     ),
//     'string'
//   );
//   t.is(
//     typeof getResolvedAst(`let a={h:{y:"hey",e:'c'},a:'r'}; a.h.e; a.a.r`),
//     'string'
//   );
//   t.is(typeof getResolvedAst(`let a = { h: 'i' }; a.h = 'j'`), 'string');
//   t.is(
//     typeof getResolvedAst(`let yo: {a:string,b:float} = {a:"y",b:1.0}`),
//     'string'
//   );
// });
// test('objects + arrays', (t) => {
//   t.is(
//     typeof getResolvedAst(`
//       let a: { hello: string[] } = { hello: [] };
//       let b: { hello: string; yo: int }[] = [
//         { hello: "string",  yo: 1 },
//         { hello: "hey",     yo: 2 }
//       ];
//       // b[1] = { hello: "there", yo: 1 };
//       `),
//     'string'
//   );
// });
// test('typedef', (t) => {
//   t.is(
//     typeof getResolvedAst(`type T = string; const str: T = "hello";`),
//     'string'
//   );
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvcmVzb2x2ZXIvaW5kZXguc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhDQUF1QjtBQUV2Qiw4Q0FBMkM7QUFDM0MsMkRBQW1DO0FBRW5DLDBCQUF3QjtBQUV4QixNQUFNLGVBQWUsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFO0lBQ3ZDLE1BQU0sUUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBQztRQUM1QixRQUFRLEVBQUUsRUFBRTtRQUNaLFdBQVcsRUFBRSxJQUFJO0tBQ2xCLENBQUMsQ0FBQztJQUNILE9BQU8sUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3BDLENBQUMsQ0FBQztBQUVGLE1BQU0sY0FBYyxHQUFHLENBQUMsSUFBWSxFQUFFLEVBQUUsV0FDdEMsT0FBQSxNQUFBLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLDBDQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUcsQ0FBQSxFQUFBLENBQUM7QUFFbkQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBRWpFLGFBQWE7QUFDYixNQUFNLFlBQVksR0FBRyxDQUFDLFFBQWdCLEVBQW9CLEVBQUU7SUFDMUQsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUMzQixpQkFBTyxDQUFDLCtCQUErQixRQUFRLEtBQUssQ0FBQyxDQUN0RCxDQUFDO0lBQ0YsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUMxQixpQkFBTyxDQUFDLCtCQUErQixRQUFRLElBQUksQ0FBQyxDQUNyRCxDQUFDO0lBQ0YsT0FBTyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUM7QUFFRixhQUFJLENBQUMsSUFB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