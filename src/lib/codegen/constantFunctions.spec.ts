import test from 'ava';

import {
  generateArrayTypeName,
  generateObjectUtils,
} from './constantFunctions';

// import { generateArrayUtils, genFunc, genStruct } from './constantFunctions';

test.todo('constant placeholder');

// test('Test generation of array utils with string fieldType', (t) => {
//   t.is(
//     generateArrayUtils('string'),
//     `typedef struct {
//   size_t length;
//   size_t capacity;
//   string *value;
// } string_array;
// string_array init_string_array(size_t length) {
//   size_t capacity = length;
//   if (length < 2) capacity = 2;
//   string* value = (string*)malloc(sizeof(string) * capacity);
//   return (string_array){length, capacity, value};
// }
// void push_string_array(string_array *arr, string value) {
//   if (arr->length == arr->capacity) {
//     arr->capacity *= 2;
//     arr->value = (string *)realloc(arr->value, arr->capacity * sizeof(string));
//   }
//   arr->value[arr->length++] = value;
// }
// string get_string_array(string_array *arr, size_t i) {
//   if (i >= arr->length) {
//   // ERROR
//   }
//   return arr->value[i];
// }
// void set_string_array(string_array *arr, size_t i, string value) {
//   if (i >= arr->length) {
//   // ERROR
//   }
//   arr->value[i] = value;
// }
// void destroy_string_array(string_array *arr) {
//   free((void*)arr->value);
//   arr->value = NULL;
//   arr->capacity = arr->length = 0;
// }`
//   );
// });

// test('Generate struct', (t) => {
//   t.is(
//     genStruct(
//       `string_array`,
//       ['length', 'capacity', '*value'],
//       ['size_t', 'size_t', `string`]
//     ),
//     `typedef struct {
//   size_t length;
//   size_t capacity;
//   string *value;
// } string_array;`
//   );
// });

// test('Generate function', (t) => {
//   t.is(
//     genFunc(
//       `init_string_array`,
//       [
//         'size_t capacity = length;',
//         'if (length < 2) capacity = 2;',
//         `string* value = (string*)malloc(sizeof(string) * capacity);`,
//         `return (string_array){length, capacity, value};`,
//       ],
//       ['length'],
//       ['size_t'],
//       'string_array',
//       false
//     ),
//     `string_array init_string_array(size_t length) {
//   size_t capacity = length;
//   if (length < 2) capacity = 2;
//   string* value = (string*)malloc(sizeof(string) * capacity);
//   return (string_array){length, capacity, value};
// }`
//   );
// });

// test('Generate Objects', (t) => {
//   const obj = generateObjectUtils('Sample', {
//     variableType: 'object',
//     fields: {
//       name: 'string',
//       a: 'int',
//       yo: {
//         variableType: 'object',
//         fields: {
//           b: 'int',
//           c: {
//             variableType: 'object',
//             fields: {
//               c: 'int',
//             },
//             subTypes: [],
//             typeAlias: 'obj3',
//           },
//         },
//         typeAlias: 'obj2',
//         subTypes: [],
//       },
//     },
//     typeAlias: 'obj1',
//     subTypes: [],
//   });
//   t.is(
//     obj,
//     [
//       'struct _Sample {',
//       '  string name;',
//       '  int a;',
//       '  obj2* yo;',
//       '};',
//       'Sample* init_Sample(string name, int a, obj2* yo) {',
//       '  Sample* temp = (Sample *)malloc(sizeof(Sample));',
//       '  temp->name = name;',
//       '  temp->a = a;',
//       '  temp->yo = yo;',
//       '  return temp;',
//       '}',
//       'void destroy_Sample(Sample* obj) {\n  free(obj);\n}',
//     ].join('\n')
//   );

//   const obj2 = generateObjectUtils('ArrayBased', {
//     variableType: 'object',
//     fields: {
//       arr: {
//         variableType: 'array',
//         fields: {},
//         subTypes: ['int'],
//         typeAlias: 'int_array',
//       },
//       yo: {
//         variableType: 'object',
//         fields: {
//           a: 'int',
//         },
//         subTypes: [],
//         typeAlias: 'some_obj',
//       },
//     },
//     subTypes: [],
//   });

//   t.is(
//     obj2,
//     [
//       'struct _ArrayBased {\n  int_array* arr;\n  some_obj* yo;\n};',
//       'ArrayBased* init_ArrayBased(int_array* arr, some_obj* yo) {',
//       '  ArrayBased* temp = (ArrayBased *)malloc(sizeof(ArrayBased));',
//       '  temp->arr = arr;\n  temp->yo = yo;\n  return temp;\n}',
//       'void destroy_ArrayBased(ArrayBased* obj) {\n  free(obj);\n}',
//     ].join('\n')
//   );
// });

// test('Array Type', (t) => {
//   t.is(
//     generateArrayTypeName({
//       variableType: 'array',
//       subTypes: ['int'],
//     }),
//     'int_array'
//   );
//   t.is(
//     generateArrayTypeName({
//       variableType: 'array',
//       subTypes: [
//         {
//           variableType: 'array',
//           subTypes: ['int'],
//         },
//       ],
//     }),
//     'int_array_array'
//   );
// });
