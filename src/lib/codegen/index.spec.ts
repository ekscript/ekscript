import test from 'ava';
import { getFile } from '../utils/fileOps';
import Compiler from '../compiler';

const getResolvedCode = (code: string): Compiler => {
  const compiler = new Compiler({
    filePath: '',
    fileContent: code,
  });
  return compiler.parse().resolve();
};

const getCompiledCode = (compiler: Compiler): string => {
  return compiler.generateCode();
};

const getFileCodes = (fileName: string): [string, string] | never => {
  const resolvedCompiler = getResolvedCode(
    getFile(`./testFiles/${fileName}.ek`)
  );
  const genCode = getCompiledCode(resolvedCompiler);
  const cFile = getFile(`./testFiles/${fileName}.c`);
  return [genCode, cFile];
};

test.todo('placeholder');

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

test('Array Codegen', (t) => {
  const [genCode, cFile] = getFileCodes('03_arrays');
  t.is(genCode, cFile);
});

test('Objects', (t) => {
  const [genCode, cFile] = getFileCodes('04_objects');
  t.is(genCode, cFile);
});

test('Type definition Test', (t) => {
  const [genCode, cFile] = getFileCodes('05_typedef');
  t.is(genCode, cFile);
});
