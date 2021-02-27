import { ArrayNode, SubVariableType } from 'tree-sitter-ekscript';

export function getArrayName(node: ArrayNode) {
  const subTypes = node.subVariableType?.subTypes!;
  const array_field_type = subTypes[0]!;
  let array_name = '';
  if (typeof array_field_type == 'string') {
    array_name = array_field_type;
  } else {
    array_name = '';
    let subType: SubVariableType = array_field_type;
    while (typeof subType != 'string') {
      array_name += `_array`;
      subType = subType.subTypes![0] as SubVariableType;
    }
    array_name = `${subType}${array_name}`;
  }
  return array_name + '_array';
}
