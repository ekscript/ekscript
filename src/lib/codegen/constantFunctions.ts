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
      val + `${argTypes[i]} ${curr}` + (i != args.length - 1 ? ', ' : ''),
    ''
  );
  return `${
    isGlobal ? 'static' : ''
  }${returnType} ${name}(${argWithTypes}) {\n  ${statements.join('\n  ')}\n}`;
}

export function genStruct(
  name: string,
  fields: string[],
  fieldTypes: string[]
) {
  const fieldsStr = fields.reduce(
    (val, curr, i) =>
      val +
      fieldTypes[i] +
      ' ' +
      curr +
      ';\n' +
      (i == fields.length - 1 ? '' : '  '),
    ''
  );
  return `typedef struct {\n  ${fieldsStr}} ${name};`;
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

export function generateArrayUtils(arrType: string) {
  const arr: string[] = [];
  arr.push(
    genStruct(
      `${arrType}_array`,
      ['length', 'capacity', '*value'],
      ['size_t', 'size_t', `${arrType}`]
    )
  );

  // init_array
  arr.push(
    genFunc(
      `init_${arrType}_array`,
      [
        'size_t capacity = length;',
        'if (length < 2) capacity = 2;',
        `${arrType}* value = (${arrType}*)malloc(sizeof(${arrType}) * capacity);`,
        `return (${arrType}_array){length, capacity, value};`,
      ],
      ['length'],
      ['size_t'],
      arrType + '_array',
      false
    )
  );

  // push_array, arr.push(value)
  arr.push(
    genFunc(
      `push_${arrType}_array`,
      [
        'if (arr->length == arr->capacity) {',
        '  arr->capacity *= 2;',
        `  arr->value = (${arrType} *)realloc(arr->value, arr->capacity * sizeof(${arrType}));`,
        '}',
        `arr->value[arr->length++] = value;`,
      ],
      ['*arr', 'value'],
      [`${arrType}_array`, arrType],
      'void',
      false
    )
  );

  // get_element, arr[index]
  arr.push(
    genFunc(
      `get_${arrType}_array`,
      ['if (i >= arr->length) {', '// ERROR', '}', `return arr->value[i];`],
      ['*arr', 'i'],
      [`${arrType}_array`, 'size_t'],
      arrType,
      false
    )
  );

  // set_element, arr[index] = value
  arr.push(
    genFunc(
      `set_${arrType}_array`,
      ['if (i >= arr->length) {', '// ERROR', '}', `arr->value[i] = value;`],
      ['*arr', 'i', 'value'],
      [`${arrType}_array`, 'size_t', arrType],
      'void',
      false
    )
  );

  // destroy_array
  arr.push(
    genFunc(
      `destroy_${arrType}_array`,
      [
        'free((void*)arr->value);',
        'arr->value = NULL;',
        'arr->capacity = arr->length = 0;',
      ],
      ['*arr'],
      [`${arrType}_array`],
      'void',
      false
    )
  );
  return arr.join('\n');
}
