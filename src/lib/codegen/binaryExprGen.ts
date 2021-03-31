import { ValueNode, BinaryExpressionNode, SyntaxNode } from 'tree-sitter-ekscript';
import CodeGen from './index';

export function visitBinaryExpr(codegen: CodeGen, node: BinaryExpressionNode) {
  const left = node.leftNode as ValueNode;
  const operator = node.operatorNode;
  const right = node.rightNode as ValueNode;

  if (left?.type == 'string') {
    codegen.addInclude('ekstr');
    let rightType: string = right?.type!;
    switch (rightType) {
      case 'int_literal':
      // @ts-ignore
      case 'float_literal': {
        rightType = rightType.slice(0, rightType.length - 8);
      }
      case 'true':
      case 'false':
      case 'null':
      case 'char':
      case 'string': {
        let rightText = right?.text!;
        const leftText = left.text.slice(1, left.text.length - 1);
        if (rightType == 'string' || rightType == 'char')
          rightText = rightText.slice(1, rightText.length - 1);
        const finalValue = `"${leftText}${rightText}"`;
        const tempVar = `temp${codegen.numTempVars++}`;
        codegen.currentFunc.body.push(
          `${
            codegen.indent
          }const string ${tempVar} = init_string( ${finalValue}, ${
            finalValue.length - 2
          } ) ;`
        );
        codegen.currentScope.destructors[tempVar] = 'string';
        codegen.addCol(tempVar);
        break;
      }
      case 'parenthesized_expression':
      case 'identifier': {
        const identifierType = right.variableType;
        const tempVar = `temp${codegen.numTempVars++}`;
        const stringInit = `const string ${tempVar} = init_string( ${
          left.text
        }, ${left.text.length - 2} ) ;`;
        codegen.currentScope.destructors[tempVar] = 'string';
        codegen.currentFunc.body.push(codegen.indent + stringInit);
        codegen.addCol(
          `concat_string_${identifierType}( ${tempVar}, ${right?.text})`
        );
        break;
      }
      default: {
      }
    }
  } else {
    switch (operator.text) {
      case '+': {
        if (left.variableType == 'string' && right.variableType == 'string') {
          if (right.type == 'string') codegen.addCol('concat_string_char (');
          else if (right.type == 'identifier') codegen.addCol(')');
          codegen.visit(left);
          codegen.addCol(',');
          codegen.visit(right);
          codegen.addCol(')');
        } else {
          codegen.visit(left as SyntaxNode);
          codegen.addCol(operator.text);
          codegen.visit(right as SyntaxNode);
        }
        break;
      }
      case '==': {
        if (left.variableType == 'string' && right.variableType == 'string') {
          if (right.type == 'string') codegen.addCol('compare_string_char (');
          else if (right.type == 'identifier') codegen.addCol(')');
          codegen.visit(left);
          codegen.addCol(',');
          codegen.visit(right);
          if (right.type == 'string')
            codegen.addCol(`, ${right.text.length - 2}`);
          codegen.addCol(')');
        } else {
          codegen.visit(left as SyntaxNode);
          codegen.addCol(operator.text);
          codegen.visit(right as SyntaxNode);
        }
        break;
      }
      default:
        codegen.visit(left);
        codegen.addCol(operator.text);
        codegen.visit(right);
        break;
    }
  }
}
