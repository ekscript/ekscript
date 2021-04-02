/**
* ====================
* Resolves the types
* ====================
* */

import Resolver from './index';
import {
  IdentifierNode,
  ValueNode,
  ObjectTypeNode,
  SyntaxNode,
  SubVariableType,
  TypeAliasDeclarationNode,
  TypeAnnotationNode,
  ArrayTypeNode,
  PropertySignatureNode,
} from 'tree-sitter-ekscript';
import { IVarKind } from '../../types/compiler';
import { loopNamedNodeChild } from '../utils/iterators';

import { logFactory } from '../utils/fileOps';
const log = logFactory(__filename);

export function visitObjectType(
  resolver: Resolver,
  node: ObjectTypeNode,
  generator = false
) {
  node.variableType = 'object';
  const subVariableType: {
    variableType: string;
    fields: Record<string, string | SubVariableType>;
  } = {
    variableType: 'object',
    fields: {},
  };

  for (const { child } of loopNamedNodeChild(node)) {
    const { nameNode, typeNode } = child as PropertySignatureNode;
    if (typeNode) {
      visitTypeAnnotation(resolver, typeNode);

      child.variableType = typeNode.variableType;
      (child as ValueNode).subVariableType = typeNode.subVariableType;

      // log(
      //   nameNode.text,
      //   typeNode?.firstNamedChild?.type,
      //   typeNode.variableType,
      //   typeNode.subVariableType
      // );

      if (typeNode?.firstNamedChild?.type == 'predefined_type') {
        subVariableType.fields[nameNode.text] = typeNode.variableType;
      } else {
        subVariableType.fields[nameNode.text] = typeNode.subVariableType;
      }
    }
  }

  node.subVariableType = subVariableType;
}

export function visitArrayType(
  resolver: Resolver,
  node: ArrayTypeNode,
  generator = false
) {
  const mainType = node.firstNamedChild as ValueNode;
  visitTypeAnnotation(
    resolver,
    (node as SyntaxNode) as TypeAnnotationNode,
    generator
  );
  node.variableType = 'array';
  node.subVariableType = { subTypes: [], variableType: 'array' };

  if (generator) {
    const typeAlias = `anon_array${resolver.counter++}`;
    node.subVariableType.typeAlias = typeAlias;
    resolver._generators.set(typeAlias, node.subVariableType);
  }

  switch (mainType.type) {
    case 'predefined_type': {
      if (mainType?.variableType)
        node.subVariableType.subTypes?.push(mainType?.variableType);
      break;
    }
    case 'type_identifier': {
      if (mainType?.variableType)
        node.subVariableType.subTypes?.push(mainType?.variableType);
      break;
    }
    default: {
      if (mainType?.subVariableType)
        node.subVariableType.subTypes?.push(mainType?.subVariableType);
      break;
    }
  }
}

/**
 * Resolves the type annotation node
 * @param node The TypeAnnotationNode
 * @param generator Whether to generate the sub nodes
 **/
export function visitTypeAnnotation(
  resolver: Resolver,
  node: TypeAnnotationNode,
  generator = false
) {
  const mainType = node.firstNamedChild;
  switch (mainType?.type) {
    case 'predefined_type': {
      switch (mainType?.text) {
        case 'int':
        case 'float':
        case 'boolean':
        case 'string':
        case 'char': {
          node.variableType = mainType.text;
          mainType.variableType = mainType.text;
          break;
        }
        default: {
          break;
        }
      }
      break;
    }
    case 'array_type': {
      visitArrayType(resolver, mainType as ArrayTypeNode, generator);
      node.variableType = mainType.variableType;
      node.subVariableType = mainType.subVariableType;
      break;
    }
    case 'object_type': {
      visitObjectType(resolver, mainType as ObjectTypeNode);
      node.variableType = mainType.variableType;
      node.subVariableType = mainType.subVariableType;
      break;
    }
    case 'type_identifier': {
      resolver.visitIdentifier(mainType as IdentifierNode);
      node.variableType = mainType.variableType;
      node.subVariableType = mainType.subVariableType;
      break;
    }
    default: {
      if (mainType != null) console.log('Unknown type..', mainType.toString());
    }
  }
}

// --------------------------------------------

export function visitTypeAliasDeclaration(
  resolver: Resolver,
  node: TypeAliasDeclarationNode
) {
  const { nameNode, valueNode } = node;
  switch (valueNode.type) {
    case 'predefined_type': {
      const varType = valueNode.text;
      switch (varType) {
        case 'string':
        case 'int':
        case 'float':
        case 'boolean':
        case 'null': {
          nameNode.variableType = varType;
          valueNode.variableType = varType;
          node.variableType = varType;
          break;
        }
        default: {
          console.log(
            'visitTypeAliasDeclaration: Unknown type',
            valueNode.text
          );
          break;
        }
      }
      break;
    }
    case 'object_type': {
      log('visitTypeAliasDeclaration: ...');
      visitObjectType(resolver, valueNode);
      const varType = valueNode.variableType;
      const subVarType = valueNode.subVariableType;
      node.variableType = varType;
      node.subVariableType = subVarType;
      nameNode.variableType = varType;
      nameNode.subVariableType = subVarType;
      break;
    }
    default: {
      break;
    }
  }
  // @ts-ignore
  resolver.addIdentifierToEnv(nameNode, IVarKind.typeDef);
}
