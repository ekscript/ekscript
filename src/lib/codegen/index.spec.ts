import test from 'ava';

import { getFile } from '../../utils/fileOps';
import Compiler from '../compiler';

const getCompiledCode = (code: string): string => {
  const compiler = new Compiler({
    filePath: '',
    fileContent: code,
  });
  return compiler.parse().resolve().generateCode();
};

const getFileCodes = (fileName: string): [string, string] => {
  const genCode = getCompiledCode(getFile(`./testFiles/${fileName}.ek`));
  const cFile = getFile(`./testFiles/${fileName}.c.txt`);
  return [genCode, cFile];
};

test.todo('placeholder');

// test('Test empty code', (t) => {
//   const genCode = getCompiledCode('');
//   t.is(genCode, 'int main(int argc, char **argv) {\n  return 0 ;\n}\n');
// });

// test('Basic expressions & literals - I', (t) => {
//   const [genCode, cFile] = getFileCodes('basicexprlit1');
//   t.is(genCode, cFile);
// });

// test('While, For, Switch', (t) => {
//   const [genCode, cFile] = getFileCodes('02_while_switch_for');
//   t.is(genCode, cFile);
// });

test('Array', (t) => {
  const [genCode, cFile] = getFileCodes('03_arrays');
  t.is(genCode, cFile);
});

// test('Objects', (t) => {
//   const [genCode, cFile] = getFileCodes('04_objects');
//   t.is(genCode, cFile);
// });
