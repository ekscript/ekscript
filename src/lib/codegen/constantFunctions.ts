export function genMain(statements: string[]) {
  return `int main(int argc, char **argv) {
${statements.join('\n')}
  return 0;
}
`;
}

export function genFunc(
  name: string,
  statements: string[],
  args: string[],
  argTypes: string[],
  returnType: string,
  isGlobal: boolean
) {
  const argWithTypes = args.reduce(
    (val: string, curr: string, i: number) =>
      val + `${argTypes[i]} ${curr}` + (i != args.length - 1 ? ',' : '')
  );
  return `${
    isGlobal ? 'static' : ''
  } ${returnType} ${name}(${argWithTypes}) {${statements.join('\n')}}`;
}

export function genStruct(
  name: string,
  fields: string[],
  fieldTypes: string[],
  typeDefName?: string
) {
  return (
    (typeDefName ? 'typedef' : '') +
    `struct ${name} { ${fields.reduce(
      (val, curr, i) => val + fieldTypes[i] + ' ' + curr + ';'
    )} }` +
    (typeDefName ? typeDefName : '') +
    ';'
  );
}

export function genEnum(
  name: string,
  fields: string[],
  defaultVal: (string | null)[],
  typeDefName: string
) {
  const modFields = fields.map((field, i) => {
    let val = field;
    if (defaultVal[i] != null && defaultVal[i]?.length != 0) {
      val += '=' + defaultVal[i];
      if (i != fields.length - 1) val += ',';
    }
    return val;
  });
  return (
    (typeDefName ? 'typedef' : '') +
    `enum ${name} {\n\t${modFields.join('\n\t')}` +
    (typeDefName ? typeDefName : '') +
    ';'
  );
}
