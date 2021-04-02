"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
// import { generateArrayUtils, genFunc, genStruct } from './constantFunctions';
ava_1.default.todo('constant placeholder');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRGdW5jdGlvbnMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvY29kZWdlbi9jb25zdGFudEZ1bmN0aW9ucy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBT3ZCLGdGQUFnRjtBQUVoRixhQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFbEMsd0VBQXdFO0FBQ3hFLFVBQVU7QUFDVixvQ0FBb0M7QUFDcEMsd0JBQXdCO0FBQ3hCLG1CQUFtQjtBQUNuQixxQkFBcUI7QUFDckIsbUJBQW1CO0FBQ25CLGtCQUFrQjtBQUNsQixrREFBa0Q7QUFDbEQsOEJBQThCO0FBQzlCLGtDQUFrQztBQUNsQyxnRUFBZ0U7QUFDaEUsb0RBQW9EO0FBQ3BELElBQUk7QUFDSiw0REFBNEQ7QUFDNUQsd0NBQXdDO0FBQ3hDLDBCQUEwQjtBQUMxQixrRkFBa0Y7QUFDbEYsTUFBTTtBQUNOLHVDQUF1QztBQUN2QyxJQUFJO0FBQ0oseURBQXlEO0FBQ3pELDRCQUE0QjtBQUM1QixhQUFhO0FBQ2IsTUFBTTtBQUNOLDBCQUEwQjtBQUMxQixJQUFJO0FBQ0oscUVBQXFFO0FBQ3JFLDRCQUE0QjtBQUM1QixhQUFhO0FBQ2IsTUFBTTtBQUNOLDJCQUEyQjtBQUMzQixJQUFJO0FBQ0osaURBQWlEO0FBQ2pELDZCQUE2QjtBQUM3Qix1QkFBdUI7QUFDdkIscUNBQXFDO0FBQ3JDLEtBQUs7QUFDTCxPQUFPO0FBQ1AsTUFBTTtBQUVOLG1DQUFtQztBQUNuQyxVQUFVO0FBQ1YsaUJBQWlCO0FBQ2pCLHdCQUF3QjtBQUN4QiwwQ0FBMEM7QUFDMUMsdUNBQXVDO0FBQ3ZDLFNBQVM7QUFDVCx3QkFBd0I7QUFDeEIsbUJBQW1CO0FBQ25CLHFCQUFxQjtBQUNyQixtQkFBbUI7QUFDbkIsbUJBQW1CO0FBQ25CLE9BQU87QUFDUCxNQUFNO0FBRU4scUNBQXFDO0FBQ3JDLFVBQVU7QUFDVixlQUFlO0FBQ2YsNkJBQTZCO0FBQzdCLFVBQVU7QUFDVix1Q0FBdUM7QUFDdkMsMkNBQTJDO0FBQzNDLHlFQUF5RTtBQUN6RSw2REFBNkQ7QUFDN0QsV0FBVztBQUNYLG9CQUFvQjtBQUNwQixvQkFBb0I7QUFDcEIsd0JBQXdCO0FBQ3hCLGNBQWM7QUFDZCxTQUFTO0FBQ1QsdURBQXVEO0FBQ3ZELDhCQUE4QjtBQUM5QixrQ0FBa0M7QUFDbEMsZ0VBQWdFO0FBQ2hFLG9EQUFvRDtBQUNwRCxLQUFLO0FBQ0wsT0FBTztBQUNQLE1BQU07QUFFTixvQ0FBb0M7QUFDcEMsZ0RBQWdEO0FBQ2hELDhCQUE4QjtBQUM5QixnQkFBZ0I7QUFDaEIsd0JBQXdCO0FBQ3hCLGtCQUFrQjtBQUNsQixjQUFjO0FBQ2Qsa0NBQWtDO0FBQ2xDLG9CQUFvQjtBQUNwQixzQkFBc0I7QUFDdEIsaUJBQWlCO0FBQ2pCLHNDQUFzQztBQUN0Qyx3QkFBd0I7QUFDeEIsMEJBQTBCO0FBQzFCLGlCQUFpQjtBQUNqQiw0QkFBNEI7QUFDNUIsaUNBQWlDO0FBQ2pDLGVBQWU7QUFDZixhQUFhO0FBQ2IsNkJBQTZCO0FBQzdCLHdCQUF3QjtBQUN4QixXQUFXO0FBQ1gsU0FBUztBQUNULHlCQUF5QjtBQUN6QixvQkFBb0I7QUFDcEIsUUFBUTtBQUNSLFVBQVU7QUFDVixXQUFXO0FBQ1gsUUFBUTtBQUNSLDRCQUE0QjtBQUM1QiwwQkFBMEI7QUFDMUIsb0JBQW9CO0FBQ3BCLHVCQUF1QjtBQUN2QixjQUFjO0FBQ2QsK0RBQStEO0FBQy9ELDhEQUE4RDtBQUM5RCxnQ0FBZ0M7QUFDaEMsMEJBQTBCO0FBQzFCLDRCQUE0QjtBQUM1QiwwQkFBMEI7QUFDMUIsYUFBYTtBQUNiLCtEQUErRDtBQUMvRCxtQkFBbUI7QUFDbkIsT0FBTztBQUVQLHFEQUFxRDtBQUNyRCw4QkFBOEI7QUFDOUIsZ0JBQWdCO0FBQ2hCLGVBQWU7QUFDZixpQ0FBaUM7QUFDakMsc0JBQXNCO0FBQ3RCLDZCQUE2QjtBQUM3QixrQ0FBa0M7QUFDbEMsV0FBVztBQUNYLGNBQWM7QUFDZCxrQ0FBa0M7QUFDbEMsb0JBQW9CO0FBQ3BCLHNCQUFzQjtBQUN0QixhQUFhO0FBQ2Isd0JBQXdCO0FBQ3hCLGlDQUFpQztBQUNqQyxXQUFXO0FBQ1gsU0FBUztBQUNULG9CQUFvQjtBQUNwQixRQUFRO0FBRVIsVUFBVTtBQUNWLFlBQVk7QUFDWixRQUFRO0FBQ1Isd0VBQXdFO0FBQ3hFLHVFQUF1RTtBQUN2RSwwRUFBMEU7QUFDMUUsbUVBQW1FO0FBQ25FLHVFQUF1RTtBQUN2RSxtQkFBbUI7QUFDbkIsT0FBTztBQUNQLE1BQU07QUFFTiw4QkFBOEI7QUFDOUIsVUFBVTtBQUNWLDhCQUE4QjtBQUM5QiwrQkFBK0I7QUFDL0IsMkJBQTJCO0FBQzNCLFVBQVU7QUFDVixrQkFBa0I7QUFDbEIsT0FBTztBQUNQLFVBQVU7QUFDViw4QkFBOEI7QUFDOUIsK0JBQStCO0FBQy9CLG9CQUFvQjtBQUNwQixZQUFZO0FBQ1osbUNBQW1DO0FBQ25DLCtCQUErQjtBQUMvQixhQUFhO0FBQ2IsV0FBVztBQUNYLFVBQVU7QUFDVix3QkFBd0I7QUFDeEIsT0FBTztBQUNQLE1BQU0ifQ==