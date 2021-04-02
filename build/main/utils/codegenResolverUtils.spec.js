"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
ava_1.default.todo("placeholder codegenResolver");
// test('compare arrays...', (t) => {
//   t.is(
//     compareVariableTypes(
//       'array',
//       {
//         variableType: 'array',
//         subTypes: [
//           {
//             variableType: 'array',
//             subTypes: ['int'],
//           },
//         ],
//       },
//       'array',
//       {
//         variableType: 'array',
//         subTypes: [
//           {
//             variableType: 'array',
//             subTypes: ['int'],
//           },
//         ],
//       }
//     ),
//     true
//   );
// });
// test('compare objects...', (t) => {
//   t.is(
//     compareVariableTypes(
//       'object',
//       {
//         variableType: 'object',
//         subTypes: [],
//         fields: {
//           name: 'int',
//           hey: {
//             variableType: 'array',
//             subTypes: ['int'],
//           },
//           yo: 'int',
//         },
//       },
//       'object',
//       {
//         variableType: 'object',
//         subTypes: [],
//         fields: {
//           name: 'int',
//           yo: 'int',
//           hey: {
//             variableType: 'array',
//             subTypes: ['int'],
//           },
//         },
//       }
//     ),
//     true
//   );
//   t.is(
//     compareVariableTypes(
//       'object',
//       {
//         variableType: 'object',
//         subTypes: [],
//         fields: {
//           hey: {
//             variableType: 'array',
//             subTypes: ['int'],
//           },
//         },
//       },
//       'object',
//       {
//         variableType: 'object',
//         subTypes: [],
//         fields: {
//           hey: {
//             variableType: 'array',
//             subTypes: ['string'],
//           },
//         },
//       }
//     ),
//     false
//   );
// });
// test('Mirror subVariableType...', (t) => {
//   const src: SubVariableType = {
//     variableType: 'object',
//     subTypes: [],
//     fields: {
//       name1: {
//         variableType: 'object',
//         subTypes: [],
//         fields: {
//           arr: {
//             variableType: 'array',
//             subTypes: [
//               'string',
//               {
//                 variableType: 'array',
//                 subTypes: ['string'],
//                 typeAlias: 'anon_name131d',
//               },
//             ],
//             typeAlias: 'anon_name611',
//           },
//           name: 'int',
//         },
//         typeAlias: 'anon_name1',
//       },
//     },
//     typeAlias: 'anon_name_0',
//   };
//   const des: SubVariableType = {
//     variableType: 'object',
//     subTypes: [],
//     fields: {
//       name1: {
//         variableType: 'object',
//         subTypes: [],
//         fields: {
//           arr: {
//             variableType: 'array',
//             subTypes: [
//               'string',
//               {
//                 variableType: 'array',
//                 subTypes: ['string'],
//                 typeAlias: 'anon_name131d',
//               },
//             ],
//             typeAlias: 'anon_name66',
//           },
//           name: 'int',
//         },
//         typeAlias: 'anon_name_5',
//       },
//     },
//     typeAlias: 'anon_name_4',
//   };
//   mirrorAnonNameInComplexTypes(src, des);
//   t.is(JSON.stringify(des), JSON.stringify(src));
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWdlblJlc29sdmVyVXRpbHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9jb2RlZ2VuUmVzb2x2ZXJVdGlscy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBUXZCLGFBQUksQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUV6QyxxQ0FBcUM7QUFDckMsVUFBVTtBQUNWLDRCQUE0QjtBQUM1QixpQkFBaUI7QUFDakIsVUFBVTtBQUNWLGlDQUFpQztBQUNqQyxzQkFBc0I7QUFDdEIsY0FBYztBQUNkLHFDQUFxQztBQUNyQyxpQ0FBaUM7QUFDakMsZUFBZTtBQUNmLGFBQWE7QUFDYixXQUFXO0FBQ1gsaUJBQWlCO0FBQ2pCLFVBQVU7QUFDVixpQ0FBaUM7QUFDakMsc0JBQXNCO0FBQ3RCLGNBQWM7QUFDZCxxQ0FBcUM7QUFDckMsaUNBQWlDO0FBQ2pDLGVBQWU7QUFDZixhQUFhO0FBQ2IsVUFBVTtBQUNWLFNBQVM7QUFDVCxXQUFXO0FBQ1gsT0FBTztBQUNQLE1BQU07QUFFTixzQ0FBc0M7QUFDdEMsVUFBVTtBQUNWLDRCQUE0QjtBQUM1QixrQkFBa0I7QUFDbEIsVUFBVTtBQUNWLGtDQUFrQztBQUNsQyx3QkFBd0I7QUFDeEIsb0JBQW9CO0FBQ3BCLHlCQUF5QjtBQUN6QixtQkFBbUI7QUFDbkIscUNBQXFDO0FBQ3JDLGlDQUFpQztBQUNqQyxlQUFlO0FBQ2YsdUJBQXVCO0FBQ3ZCLGFBQWE7QUFDYixXQUFXO0FBQ1gsa0JBQWtCO0FBQ2xCLFVBQVU7QUFDVixrQ0FBa0M7QUFDbEMsd0JBQXdCO0FBQ3hCLG9CQUFvQjtBQUNwQix5QkFBeUI7QUFDekIsdUJBQXVCO0FBQ3ZCLG1CQUFtQjtBQUNuQixxQ0FBcUM7QUFDckMsaUNBQWlDO0FBQ2pDLGVBQWU7QUFDZixhQUFhO0FBQ2IsVUFBVTtBQUNWLFNBQVM7QUFDVCxXQUFXO0FBQ1gsT0FBTztBQUNQLFVBQVU7QUFDViw0QkFBNEI7QUFDNUIsa0JBQWtCO0FBQ2xCLFVBQVU7QUFDVixrQ0FBa0M7QUFDbEMsd0JBQXdCO0FBQ3hCLG9CQUFvQjtBQUNwQixtQkFBbUI7QUFDbkIscUNBQXFDO0FBQ3JDLGlDQUFpQztBQUNqQyxlQUFlO0FBQ2YsYUFBYTtBQUNiLFdBQVc7QUFDWCxrQkFBa0I7QUFDbEIsVUFBVTtBQUNWLGtDQUFrQztBQUNsQyx3QkFBd0I7QUFDeEIsb0JBQW9CO0FBQ3BCLG1CQUFtQjtBQUNuQixxQ0FBcUM7QUFDckMsb0NBQW9DO0FBQ3BDLGVBQWU7QUFDZixhQUFhO0FBQ2IsVUFBVTtBQUNWLFNBQVM7QUFDVCxZQUFZO0FBQ1osT0FBTztBQUNQLE1BQU07QUFFTiw2Q0FBNkM7QUFDN0MsbUNBQW1DO0FBQ25DLDhCQUE4QjtBQUM5QixvQkFBb0I7QUFDcEIsZ0JBQWdCO0FBQ2hCLGlCQUFpQjtBQUNqQixrQ0FBa0M7QUFDbEMsd0JBQXdCO0FBQ3hCLG9CQUFvQjtBQUNwQixtQkFBbUI7QUFDbkIscUNBQXFDO0FBQ3JDLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUIsa0JBQWtCO0FBQ2xCLHlDQUF5QztBQUN6Qyx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLG1CQUFtQjtBQUNuQixpQkFBaUI7QUFDakIseUNBQXlDO0FBQ3pDLGVBQWU7QUFDZix5QkFBeUI7QUFDekIsYUFBYTtBQUNiLG1DQUFtQztBQUNuQyxXQUFXO0FBQ1gsU0FBUztBQUNULGdDQUFnQztBQUNoQyxPQUFPO0FBQ1AsbUNBQW1DO0FBQ25DLDhCQUE4QjtBQUM5QixvQkFBb0I7QUFDcEIsZ0JBQWdCO0FBQ2hCLGlCQUFpQjtBQUNqQixrQ0FBa0M7QUFDbEMsd0JBQXdCO0FBQ3hCLG9CQUFvQjtBQUNwQixtQkFBbUI7QUFDbkIscUNBQXFDO0FBQ3JDLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUIsa0JBQWtCO0FBQ2xCLHlDQUF5QztBQUN6Qyx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLG1CQUFtQjtBQUNuQixpQkFBaUI7QUFDakIsd0NBQXdDO0FBQ3hDLGVBQWU7QUFDZix5QkFBeUI7QUFDekIsYUFBYTtBQUNiLG9DQUFvQztBQUNwQyxXQUFXO0FBQ1gsU0FBUztBQUNULGdDQUFnQztBQUNoQyxPQUFPO0FBRVAsNENBQTRDO0FBQzVDLG9EQUFvRDtBQUNwRCxNQUFNIn0=