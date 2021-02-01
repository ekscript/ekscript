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

test('Basic Expr - I', (t) => {
  const [genAst, expectedAst] = getFileCodes('basicexpr1');
  t.is(genAst, expectedAst);
});

test('LexicalDeclaration-I', (t) => {
  const error = t.throws(() => {
    getResolvedCode('let a;');
  });
  t.is(error.message, 'Compilation Failed');

  const error2 = t.throws(() => {
    getResolvedCode('let a: string = 1;');
  });
  t.is(error2.message, 'Compilation Failed');

  const error3 = t.throws(() => {
    getResolvedCode('let a: string');
  });
  t.is(error3.message, 'Compilation Failed');

  t.is(
    getResolvedAst('let a: string = "", b = a;'),
    cleanStr(`(program
      (lexical_declaration
        (variable_declarator
          name: (identifier) type: (type_annotation (predefined_type)) value: (string))
        (variable_declarator name: (identifier) value: (identifier))))`)
  );
});

test('Binary expression-I', (t) => {
  const error = t.throws(() => {
    getResolvedCode('let a = 1; let b = "hello"; a + b;');
  });
  t.is(error.message, 'Compilation Failed');
});
