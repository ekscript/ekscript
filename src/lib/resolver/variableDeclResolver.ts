import {
  DestructuringPatternNode,
  ExpressionNode,
  IdentifierNode,
  IVarKind as IIVarKind,
  SubVariableType,
  TypeAnnotationNode,
  ValueNode,
  VariableDeclaratorNode,
} from 'tree-sitter-ekscript';

import { IVarKind } from '../../types/compiler';
import {
  compareVariableTypes,
  mirrorAnonNameInComplexTypes,
} from '../utils/codegenResolverUtils';
import { logFactory } from '../utils/fileOps';
import { loopNamedNodeChild } from '../utils/iterators';

import { visitArray, visitObject } from './arrayObjectResolver';
import Resolver from './index';
import { visitTypeAnnotation } from './typeResolver';

const log = logFactory(__filename);

type SubResolverReturnType = {
  nameNode: DestructuringPatternNode | IdentifierNode;
  typeNode?: TypeAnnotationNode;
  valueNode?: ExpressionNode;
  variableType: string;
  subVariableType: SubVariableType | null;
};

/**
 * Resolves `let a: string | null` & untyped `let a = { value: 1 }`
 * _Basically Variable Declarations with 2 nodes_
 * */
function resolveUntypedVarDecl(
  resolver: Resolver,
  node: VariableDeclaratorNode
): SubResolverReturnType {
  let { nameNode, typeNode, valueNode } = node;
  let variableType: string | null = null;
  let subVariableType: SubVariableType | null = null;
  if (typeNode != null) {
    // Nullable types: `let a: string | null`
    if (typeNode.firstNamedChild?.type != 'union_type') {
      resolver.addError(node, 'Non-nullable types need a initializer');
    } else {
      visitTypeAnnotation(resolver, typeNode, true);
    }
  } else if (valueNode != null) {
    // Initializer included: let a = 1; let b = a; let c = "string";
    if (valueNode.type == 'array') {
      visitArray(resolver, valueNode, true);
    } else if (valueNode.type == 'object') {
      visitObject(resolver, valueNode, true);
    } else {
      resolver.visit(valueNode);
    }
    variableType = valueNode.variableType;
    if (valueNode.subVariableType) subVariableType = valueNode.subVariableType;
  }
  variableType = variableType ?? '';
  return { nameNode, valueNode, typeNode, variableType, subVariableType };
}

// ---------------------------------------------------------------------

/**
 * Resolves Variable Declarations with 3 nodes
 * `let a: string = {}; let b: Type = { hello: world }`
 * */
function resolveTypedVarDec(
  resolver: Resolver,
  node: VariableDeclaratorNode
): SubResolverReturnType {
  let { typeNode, valueNode, nameNode } = node;
  let variableType: string = '';
  let subVariableType: SubVariableType | null = null;

  if (valueNode && typeNode) {
    if (valueNode.type == 'array') {
      visitArray(resolver, valueNode, true);
    } else if (valueNode.type == 'object') {
      visitObject(resolver, valueNode, true);
    } else {
      resolver.visit(valueNode);
    }

    const generatorMod =
      valueNode.variableType == 'array' && valueNode.namedChildCount == 0;

    visitTypeAnnotation(resolver, typeNode, generatorMod);

    const valVarType = valueNode.variableType;
    let valSubVarType = valueNode.subVariableType;
    const typeVarType = typeNode.variableType;
    const typeSubVarType = typeNode.subVariableType;

    if (valVarType == 'array' || valVarType == 'object') {
      for (const { child } of loopNamedNodeChild(valueNode)) {
        const duplicates = mirrorAnonNameInComplexTypes(
          typeSubVarType,
          (child as ValueNode).subVariableType
        );
        duplicates.forEach((dup) => delete resolver._generators[dup]);
      }
    }

    if (
      valVarType == 'array' &&
      typeVarType == 'array' &&
      valSubVarType == null &&
      typeSubVarType != null
    ) {
      valueNode.subVariableType = typeNode.subVariableType;
      variableType = typeVarType;
      subVariableType = typeSubVarType;
    } else {
      if (
        compareVariableTypes(
          typeVarType,
          typeSubVarType,
          valVarType,
          valSubVarType
        )
      ) {
        variableType = valVarType;
        subVariableType = valSubVarType;
      } else {
        resolver.addError(node, "Type Annotation and initiliazer don't match.");
      }
    }
  } else {
    resolver.addError(node, 'Either ValueNode or TypeNode is null');
  }
  return { nameNode, valueNode, typeNode, variableType, subVariableType };
}

// ---------------------------------------------------------------------

export function visitVariableDeclarator(
  resolver: Resolver,
  node: VariableDeclaratorNode
) {
  let variableType: string | null = null;
  let subVariableType: SubVariableType | null = null;
  const childCount = node.namedChildCount;

  // if node only has the variable declared and nothing else
  if (node.namedChildCount > 1) {
    // eslint-disable-next-line prefer-const
    let { nameNode, valueNode } = node;

    const resolvedSubType: SubResolverReturnType =
      childCount == 2
        ? resolveUntypedVarDecl(resolver, node)
        : resolveTypedVarDec(resolver, node);

    nameNode = resolvedSubType.nameNode;
    valueNode = resolvedSubType.valueNode;
    variableType = resolvedSubType.variableType;
    subVariableType = resolvedSubType.subVariableType;

    nameNode = nameNode as IdentifierNode;
    nameNode.isConst = node.isConst ? true : false;

    if (variableType) nameNode.variableType = variableType;
    if (subVariableType) nameNode.subVariableType = subVariableType;

    // @ts-ignore
    resolver.addIdentifierToEnv(nameNode, IVarKind.variable as IIVarKind);

    // if (variableType == 'string') resolver.addDestructor(nameNode);
    node.variableType = variableType;
    if (subVariableType) node.subVariableType = subVariableType;
  } else {
    resolver.addError(node, `Can't infer Type.`);
  }
}
