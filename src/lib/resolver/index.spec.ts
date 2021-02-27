import test from 'ava';

import { getFile } from '../../utils/fileOps';
import Compiler from '../compiler';

import 'ts-replace-all';

const getResolvedCode = (code: string) => {
  const compiler = new Compiler({
    filePath: '',
    fileContent: code,
  });
  return compiler.parse().resolve();
};

const getResolvedAst = (code: string) =>
  getResolvedCode(code).tree?.rootNode.toString()!;

const cleanStr = (s: string) => s.replaceAll(/\s+/g, ' ').trim();

const getFileCodes = (fileName: string): [string, string] => {
  const genAst = getResolvedAst(
    getFile(`./testFiles/tree-sitter-ast/${fileName}.ek`)
  );
  const expectedAst = cleanStr(
    getFile(`./testFiles/tree-sitter-ast/${fileName}.txt`)
  );
  return [genAst, expectedAst];
};

test.todo('Some TODO tasks');

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
//       (lexical_declaration
//         (variable_declarator
//           name: (identifier) type: (type_annotation (predefined_type)) value: (string))
//         (variable_declarator name: (identifier) value: (identifier))))`)
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
//       let a = 1;
//       if (a == 1) { let b = 4; }
//       else if (a == 2) { b = 3; }
//       else {}`);
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
//     switch(a) {
//       case "yo":
//       case "a": break;
//       case 1: break;
//       case "b": break;
//       default: break;
//     }`);
//     }).message,
//     'Compilation Failed'
//   );
// });

// test('arrays', (t) => {
//   t.is(
//     t.throws(() => {
//       getResolvedCode(`let a: string[] = [1]`);
//     }).message,
//     'Compilation Failed'
//   );
//   t.is(
//     typeof getResolvedAst('let b = "";let a: string[] = ["Hello", b]'),
//     'string'
//   );
//   t.is(
//     typeof getResolvedAst(
//       `let a = ["str"]; let b: string[][] = [a, ["hello world"]]; b[0];`
//     ),
//     'string'
//   );
// });
//

test('objects', (t) => {
  t.is(typeof getResolvedAst('let a = { hello: { yo: "world" } }'), 'string');
  t.is(
    typeof getResolvedAst(
      `let a = { hello: "y", a: 1 }; let b = { hello: "yo", a: 4 }; b = a;`
    ),
    'string'
  );
  t.is(
    typeof getResolvedAst(`let a={h:{y:"hey",e:'c'},a:'r'}; a.h.e; a.a.r`),
    'string'
  );
  t.is(typeof getResolvedAst(`let a = { h: 'i' }; a.h = 'j'`), 'string');

  t.is(
    typeof getResolvedAst(`let yo: {a:string,b:float} = {a:"y",b:1.0}`),
    'string'
  );
});
