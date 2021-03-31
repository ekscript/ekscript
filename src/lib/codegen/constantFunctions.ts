import { SubVariableType } from 'tree-sitter-ekscript';

export function genMain(statements: string[]) {
  return `int main(int argc, char **argv) {\n  ${statements.join(
    '\n'
  )}\n  return 0; }
`;
}

export function genFunc(
  name: string,
  statements: string[],
  args: Record<string, [argType: string, defaultVal: string | null]>,
  returnType: string,
  isGlobal = false
) {
  const arrArg = [];
  const defaultStmts = [];
  for (const key in args) {
    const [argType, defaultVal] = args[key];
    arrArg.push(`${argType} ${key}`);
    if (defaultVal) defaultStmts.push(`key = ${defaultVal} ;`);
  }
  const argWithTypes = arrArg.join(', ');
  statements = [...defaultStmts, ...statements];
  return `${
    isGlobal ? 'static' : ''
  }${returnType} ${name}(${argWithTypes}) {\n  ${statements.join('\n  ')}\n}`;
}

export function genStruct(
  name: string,
  fields: Record<string, string | SubVariableType>
) {
  const arr = [];
  for (const key in fields) {
    let fieldVal = fields[key];
    if (
      typeof fieldVal != 'string' &&
      fieldVal.variableType &&
      fieldVal.typeAlias
    ) {
      if (fieldVal.variableType == 'object') {
        fieldVal = `${fieldVal.typeAlias}*`;
      } else if (fieldVal.variableType == 'array') {
        fieldVal = fieldVal?.typeAlias;
      }
    }
    arr.push(`${fieldVal} ${key};`);
  }
  return `struct _${name} {\n  ${arr.join('\n  ')}\n};`;
}

export function genEnum(
  name: string,
  fields: Record<string, string | null> // field: defaultVal
) {
  const arr: string[] = [];
  for (const key in fields) {
    const defaultVal = fields[key];
    arr.push(`${key}${defaultVal ? ` = ${defaultVal}` : ''},`);
  }
  return `typedef enum {\n  ${arr.join('\n  ')}\n} ${name};`;
}

export function generateArrayUtils(arrType: string, subType: string) {
  const arr: string[] = [];
  // arr.push(
  //   genStruct(`${arrType}`, {
  //     length: 'size_t',
  //     capacity: 'size_t',
  //     value: `${subType}*`,
  //   })
  // );

  // // init_array
  // arr.push(
  //   genFunc(
  //     `init_${arrType}`,
  //     [
  //       'size_t capacity = length;',
  //       'if (length < 2) capacity = 2;',
  //       `${subType}* value = (${subType}*)malloc(sizeof(${subType}) * capacity);`,
  //       `return (${arrType}){length, capacity, value};`,
  //     ],
  //     { length: ['size_t', null] },
  //     arrType
  //   )
  // );

  // // push_array, arr.push(value)
  // arr.push(
  //   genFunc(
  //     `push_${arrType}`,
  //     [
  //       'if (arr->length == arr->capacity) {',
  //       '  arr->capacity *= 2;',
  //       `  arr->value = (${subType}*)realloc(arr->value, arr->capacity * sizeof(${subType}));`,
  //       '}',
  //       `arr->value[arr->length++] = value;`,
  //     ],
  //     {
  //       arr: [`${arrType}*`, null],
  //       value: [`${subType}`, null],
  //     },
  //     'void'
  //   )
  // );

  // // get_element, arr[index]
  // arr.push(
  //   genFunc(
  //     `get_${arrType}`,
  //     ['if (i >= arr->length) {', '// ERROR', '}', `return arr->value[i];`],
  //     {
  //       arr: [`${arrType}*`, null],
  //       i: ['size_t', null],
  //     },
  //     subType
  //   )
  // );

  // // set_element, arr[index] = value
  // arr.push(
  //   genFunc(
  //     `set_${arrType}`,
  //     ['if (i >= arr->length) {', '// ERROR', '}', `arr->value[i] = value;`],
  //     {
  //       arr: [`${arrType}*`, null],
  //       i: ['size_t', null],
  //       value: [subType, null],
  //     },
  //     'void'
  //   )
  // );

  // // destroy_array
  // arr.push(
  //   genFunc(
  //     `destroy_${arrType}`,
  //     [
  //       'free((void*)arr->value);',
  //       'arr->value = NULL;',
  //       'arr->capacity = arr->length = 0;',
  //     ],
  //     { arr: [`${arrType}*`, null] },
  //     'void'
  //   )
  // );
  return arr.join('\n');
}

/**
 * Generate object, initializer, destructor etc
 * TODO: add support for array types
 * */
export function generateObjectUtils(
  objectName: string,
  objType: SubVariableType
): string {
  const arr: string[] = [];
  // const objectType: SubVariableType = JSON.parse(JSON.stringify(objType));

  // arr.push(genStruct(objectName, objectType.fields as Record<string, string>));

  // const fields: Record<string, [string, string | null]> = {};
  // const defaultAlloc: string[] = [];

  // for (const fieldName in objectType.fields) {
  //   const fieldType = objectType.fields![fieldName];
  //   if (typeof fieldType == 'string') fields[fieldName] = [fieldType, null];
  //   else if (fieldType.variableType == 'object')
  //     fields[fieldName] = [`${fieldType?.typeAlias}*`, null];
  //   else if (fieldType.variableType == 'array')
  //     fields[fieldName] = [`${fieldType?.typeAlias}`, null];

  //   defaultAlloc.push(`temp->${fieldName} = ${fieldName};`);
  // }

  // if (objectType.variableType == 'array') {
  //   // Array to get the whole thing going
  // } else {
  //   objectType.subTypes?.forEach((subType) => {
  //     const objName = (subType as SubVariableType)?.variableType;
  //     const objType = ((subType as SubVariableType)
  //       .subTypes as SubVariableType[])[0];
  //     arr.push(generateObjectUtils(objName, objType));
  //   });
  // }

  // const initializer = genFunc(
  //   `init_${objectName}`,
  //   [
  //     `${objectName}* temp = (${objectName} *)malloc(sizeof(${objectName}));`,
  //     `return temp;`,
  //   ],
  //   {},
  //   `${objectName}*`
  // );
  // // destructor
  // const destructor = genFunc(
  //   `destroy_${objectName}`,
  //   [`free(obj);`],
  //   { obj: [`${objectName}*`, null] },
  //   `void`
  // );

  // arr.push(initializer, destructor);
  return arr.join('\n');
}

export function generateTypeDefs(name: string): string {
  return `typedef struct _${name} ${name};`;
}

export function generateFromGenerators(
  generators: Record<string, SubVariableType>
) {
  console.log(Object.keys(generators));
  const arr: string[] = [];

  for (const key in generators)
    arr.push(generateTypeDefs(generators[key].typeAlias!));

  for (const key in generators) {
    const subVarType = generators[key];
    if (subVarType.variableType == 'object') {
      arr.push(generateObjectUtils(subVarType.typeAlias!, subVarType));
    } else if (subVarType.variableType == 'array') {
      if (subVarType?.subTypes) {
        let subType = subVarType?.subTypes[0];
        if (typeof subType != 'string' && subType.typeAlias) {
          if (subType.variableType == 'object')
            subType = `${subType.typeAlias}*`;
          else subType = subType.typeAlias;
        }
        arr.push(generateArrayUtils(subVarType.typeAlias!, subType as string));
      }
    }
  }
  return arr.length > 0 ? arr.join('\n') : '';
}
