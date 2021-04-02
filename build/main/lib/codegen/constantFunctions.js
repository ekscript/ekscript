"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFromGenerators = exports.generateTypeDefs = exports.generateObjectUtils = exports.generateArrayUtils = exports.genEnum = exports.genStruct = exports.genFunc = exports.genMain = void 0;
function genMain(statements) {
    return `int main(int argc, char **argv) {\n  ${statements.join('\n')}\n  return 0; }
`;
}
exports.genMain = genMain;
function genFunc(name, statements, args, returnType, isGlobal = false) {
    const arrArg = [];
    const defaultStmts = [];
    for (const key in args) {
        const [argType, defaultVal] = args[key];
        arrArg.push(`${argType} ${key}`);
        if (defaultVal)
            defaultStmts.push(`key = ${defaultVal} ;`);
    }
    const argWithTypes = arrArg.join(', ');
    statements = [...defaultStmts, ...statements];
    return `${isGlobal ? 'static' : ''}${returnType} ${name}(${argWithTypes}) {\n  ${statements.join('\n  ')}\n}`;
}
exports.genFunc = genFunc;
function genStruct(name, fields) {
    const arr = [];
    for (const key in fields) {
        let fieldVal = fields[key];
        if (typeof fieldVal != 'string' &&
            fieldVal.variableType &&
            fieldVal.typeAlias) {
            if (fieldVal.variableType == 'object') {
                fieldVal = `${fieldVal.typeAlias}*`;
            }
            else if (fieldVal.variableType == 'array') {
                fieldVal = fieldVal === null || fieldVal === void 0 ? void 0 : fieldVal.typeAlias;
            }
        }
        arr.push(`${fieldVal} ${key};`);
    }
    return `struct _${name} {\n  ${arr.join('\n  ')}\n};`;
}
exports.genStruct = genStruct;
function genEnum(name, fields // field: defaultVal
) {
    const arr = [];
    for (const key in fields) {
        const defaultVal = fields[key];
        arr.push(`${key}${defaultVal ? ` = ${defaultVal}` : ''},`);
    }
    return `typedef enum {\n  ${arr.join('\n  ')}\n} ${name};`;
}
exports.genEnum = genEnum;
function generateArrayUtils(arrType, subType) {
    const arr = [];
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
exports.generateArrayUtils = generateArrayUtils;
/**
 * Generate object, initializer, destructor etc
 * TODO: add support for array types
 * */
function generateObjectUtils(objectName, objType) {
    const arr = [];
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
exports.generateObjectUtils = generateObjectUtils;
function generateTypeDefs(name) {
    return `typedef struct _${name} ${name};`;
}
exports.generateTypeDefs = generateTypeDefs;
function generateFromGenerators(generators) {
    const arr = [];
    for (const key in generators)
        arr.push(generateTypeDefs(generators[key].typeAlias));
    for (const key in generators) {
        const subVarType = generators[key];
        if (subVarType.variableType == 'object') {
            arr.push(generateObjectUtils(subVarType.typeAlias, subVarType));
        }
        else if (subVarType.variableType == 'array') {
            if (subVarType === null || subVarType === void 0 ? void 0 : subVarType.subTypes) {
                let subType = subVarType === null || subVarType === void 0 ? void 0 : subVarType.subTypes[0];
                if (typeof subType != 'string' && subType.typeAlias) {
                    if (subType.variableType == 'object')
                        subType = `${subType.typeAlias}*`;
                    else
                        subType = subType.typeAlias;
                }
                arr.push(generateArrayUtils(subVarType.typeAlias, subType));
            }
        }
    }
    return arr.length > 0 ? arr.join('\n') : '';
}
exports.generateFromGenerators = generateFromGenerators;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRGdW5jdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NvZGVnZW4vY29uc3RhbnRGdW5jdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsU0FBZ0IsT0FBTyxDQUFDLFVBQW9CO0lBQzFDLE9BQU8sd0NBQXdDLFVBQVUsQ0FBQyxJQUFJLENBQzVELElBQUksQ0FDTDtDQUNGLENBQUM7QUFDRixDQUFDO0FBTEQsMEJBS0M7QUFFRCxTQUFnQixPQUFPLENBQ3JCLElBQVksRUFDWixVQUFvQixFQUNwQixJQUFrRSxFQUNsRSxVQUFrQixFQUNsQixRQUFRLEdBQUcsS0FBSztJQUVoQixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDbEIsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO1FBQ3RCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNqQyxJQUFJLFVBQVU7WUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsVUFBVSxJQUFJLENBQUMsQ0FBQztLQUM1RDtJQUNELE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsVUFBVSxHQUFHLENBQUMsR0FBRyxZQUFZLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQztJQUM5QyxPQUFPLEdBQ0wsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQ3hCLEdBQUcsVUFBVSxJQUFJLElBQUksSUFBSSxZQUFZLFVBQVUsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQzlFLENBQUM7QUFuQkQs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