import test from 'ava';

// import { getFile } from '../../utils/fileOps';
import Compiler from '../compiler';

const getCompiledCode = (code: string): string => {
  const compiler = new Compiler({
    filePath: '',
    fileContent: code,
  });
  return compiler.parse().generateCode();
};

// const getFileCodes = (fileName: string): [string, string] => {
//   const genCode = getCompiledCode(getFile(`./testFiles/${fileName}.ek`));
//   const cFile = getFile(`./testFiles/${fileName}.c.txt`);
//   return [genCode, cFile];
// };

test('Test empty code', (t) => {
  const genCode = getCompiledCode('');
  t.is(genCode, 'int main() { return 0; }\n');
});

// test('Basic expressions & literals - I', (t) => {
//   const [genCode, cFile] = getFileCodes('basicexprlit1');
//   t.is(genCode, cFile);
// });

// test('Basic expressions & literals - II', (t) => {
//   const [genCode, cFile] = getFileCodes('basicexprlit2');
//   t.is(genCode, cFile);
// });
