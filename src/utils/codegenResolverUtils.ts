import {
  IdentifierDetails,
  StatementBlockNode,
  SyntaxNode,
  VariableDeclaratorNode,
} from 'tree-sitter-ekscript';

export const matchLiteralType = (lit: string) =>
  lit == 'int_literal' ||
  lit == 'float_literal' ||
  lit == 'char' ||
  lit == 'string' ||
  lit == 'null' ||
  lit == 'true' ||
  lit == 'false';

/**
 * Get the { type, kind: VarKind } for an identifier WRT environments
 * @param identifierName    name of the identifier to find
 * @param node              parent node of the identifier
 * */
export function getEnvValueRecursively(
  identifierName: string,
  node: SyntaxNode
): IdentifierDetails | null {
  if (node == null) return null;
  if (node!.type == 'statement_block' || node!.type == 'program') {
    node = node as StatementBlockNode;
    if (node?.env[identifierName] != null) return node?.env[identifierName];
    return getEnvValueRecursively(identifierName, node.parent!);
  }
  return getEnvValueRecursively(identifierName, node.parent!);
}

/**
 * TODO: Later on manage complex types
 * TODO: identifier
 * TODO: verify nullable types
 * Returns the type from a variable declaration node
 * @param node Must be a node of type variable_declarator
 * @returns
 * */
export function detectTypeFromVariableDecl(node: VariableDeclaratorNode) {
  if (node.type != 'variable_declarator')
    throw new Error('Compilation Error. Not a variable declarator node');

  let variableType = '';

  if (node.namedChildCount == 1) {
    // let a
    throw new Error('Compilation Error.');
  } else if (node.namedChildCount == 2) {
    // for `let a: int` || `let a = 1`
    // TODO: consider nullable

    const lastChild = node.lastNamedChild!;
    if (lastChild.type == 'type_annotation') {
      // let a: int
      const nodeType = lastChild.firstNamedChild?.type;
      variableType = lastChild.firstNamedChild?.text!;
      if (nodeType == 'predefined_type') {
        throw new Error(
          'Non-nullable type. Initialize the variable or set it as a nullable type'
        );
      } else {
        // check if the type is nullable. error if not
      }
    } else {
      // let a = 1, b = 'string', c = a;
      switch (lastChild.type!) {
        case 'int_literal':
          return 'int';
        case 'float_literal':
          return 'float';
        case 'char':
        case 'null':
        case 'string':
          return lastChild.type!;
        case 'true':
        case 'false':
          return 'bool';
        default:
          // TODO: work on complex types
          return '';
      }
    }
  } else if (node.namedChildCount == 3) {
    // let a: string = '1', let b: boolean = c
    const typeChild = node.namedChild(1)!;
    const initVal = node.namedChild(2)!;
    const initValType = initVal?.type!;

    if (typeChild?.type == 'type_annotation') {
      const getType = (variableType: string): string => {
        if (initValType == variableType) return variableType;
        if (initValType == 'identifier') {
          const idDetails = getEnvValueRecursively(initVal?.text, node.parent!);
          if (idDetails == null) throw new Error('Undefined variable.');
          else {
            variableType = idDetails.type;
            if (variableType == variableType) return variableType;
            throw new Error(
              `Type mismatch between: ${typeChild.type} & ${variableType}`
            );
          }
        }
        throw new Error(`Expected String initial value. Got ${initValType}`);
      };
      variableType = typeChild.firstNamedChild?.text!;

      switch (variableType) {
        case 'boolean':
          getType(variableType);
          return 'bool';
        case 'int_literal':
          getType(variableType);
          return 'int';
        case 'float_literal':
          getType(variableType);
          return 'float';
        case 'char':
        case 'string':
          return getType(variableType);
        default:
          return variableType;
      }
    }
  }
  return variableType;
}
