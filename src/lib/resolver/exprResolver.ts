import { BinaryExpressionNode, UnaryExpressionNode, ValueNode } from 'tree-sitter-ekscript';
import Resolver from './index';
import { isComparisionOperator } from '../utils/codegenResolverUtils';

export function visitBinaryExpr(
  resolver: Resolver,
  node: BinaryExpressionNode
) {
  resolver.visit(node.leftNode);
  resolver.visit(node.rightNode);

  const leftType = (node.leftNode as ValueNode).variableType;
  const op = node.operatorNode.type;
  const rightType = (node.rightNode as ValueNode).variableType;

  node.variableType = leftType;

  switch (leftType) {
    case 'string': {
      switch (op) {
        case '==':
        case '!=': {
          if (
            rightType != 'string' &&
            rightType != 'null' &&
            rightType != 'char'
          ) {
            resolver.addError(node, `'${op}' operator not allowed for strings`);
            break;
          }
          node.variableType = 'boolean';
          break;
        }
        case '+': {
          break;
        }
        default: {
          resolver.addError(node, `'${op}' operator not allowed for strings`);
          break;
        }
      }

      switch (rightType) {
        case 'int':
        case 'float':
        case 'bigint':
        case 'char':
        case 'string':
        case 'boolean':
        case 'null': {
          break;
        }
        default:
          resolver.addError(
            node.leftNode,
            `${leftType} ${op} ${rightType} not pemitted`
          );
      }
      break;
    }
    case 'int':
    case 'float':
    // @ts-ignore
    case 'bigint': {
      switch (rightType) {
        case 'int':
        case 'float':
        case 'bigint': {
          if (isComparisionOperator(op)) {
            node.variableType = 'boolean';
          }
          break;
        }
        default: {
          resolver.addError(
            node.rightNode,
            `'${op}' not allowed between ${leftType} & ${rightType}`
          );
        }
      }
      break;
    }
    case 'char': {
      if (isComparisionOperator(op)) {
        node.variableType = 'boolean';
      }
      if (!(rightType == 'char' || rightType == 'int')) {
        resolver.addError(
          node.rightNode,
          `'${op}' not allowed between ${leftType} & ${rightType}`
        );
      }
      break;
    }
    default: {
      resolver.addError(node, `Not possible to operator on the two operands`);
    }
  }
}

export function visitUnaryExpr(resolver: Resolver, node: UnaryExpressionNode) {
  const opType = node.operatorNode.type;
  const expr = node.argumentNode;
  resolver.visit(expr);
  const varType = (expr as ValueNode).variableType;

  switch (opType) {
    case '!': {
      if (varType != 'boolean') {
        resolver.addError(node, `operation '${opType}' or ${varType}!`);
      } else {
        node.variableType = 'boolean';
      }
      break;
    }
    case '~':
    case '-':
    case '+': {
      switch (varType) {
        case 'int':
        case 'float':
        case 'bigint':
        case 'boolean':
          break;
        default: {
          resolver.addError(node, `operation '${opType}' or ${varType}!`);
          break;
        }
      }
      break;
    }
    case 'delete':
    case 'void': {
      node.variableType = 'void';
      break;
    }
    case 'typeof': {
      // TODO: handle this to be a type node
      break;
    }
    default: {
      break;
    }
  }
}
