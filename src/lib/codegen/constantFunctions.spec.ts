import test from 'ava';

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
