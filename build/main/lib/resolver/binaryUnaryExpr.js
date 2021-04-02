"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitUnaryExpr = exports.visitBinaryExpr = void 0;
const codegenResolverUtils_1 = require("../utils/codegenResolverUtils");
function visitBinaryExpr(resolver, node) {
    resolver.visit(node.leftNode);
    resolver.visit(node.rightNode);
    const leftType = node.leftNode.variableType;
    const op = node.operatorNode.type;
    const rightType = node.rightNode.variableType;
    node.variableType = leftType;
    switch (leftType) {
        case 'string': {
            switch (op) {
                case '==':
                case '!=': {
                    if (rightType != 'string' &&
                        rightType != 'null' &&
                        rightType != 'char') {
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
                    resolver.addError(node.leftNode, `${leftType} ${op} ${rightType} not pemitted`);
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
                    if (codegenResolverUtils_1.isComparisionOperator(op)) {
                        node.variableType = 'boolean';
                    }
                    break;
                }
                default: {
                    resolver.addError(node.rightNode, `'${op}' not allowed between ${leftType} & ${rightType}`);
                }
            }
            break;
        }
        case 'char': {
            if (codegenResolverUtils_1.isComparisionOperator(op)) {
                node.variableType = 'boolean';
            }
            if (!(rightType == 'char' || rightType == 'int')) {
                resolver.addError(node.rightNode, `'${op}' not allowed between ${leftType} & ${rightType}`);
            }
            break;
        }
        default: {
            resolver.addError(node, `Not possible to operator on the two operands`);
        }
    }
}
exports.visitBinaryExpr = visitBinaryExpr;
function visitUnaryExpr(resolver, node) {
    const opType = node.operatorNode.type;
    const expr = node.argumentNode;
    resolver.visit(expr);
    const varType = expr.variableType;
    switch (opType) {
        case '!': {
            if (varType != 'boolean') {
                resolver.addError(node, `operation '${opType}' or ${varType}!`);
            }
            else {
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
exports.visitUnaryExpr = visitUnaryExpr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluYXJ5VW5hcnlFeHByLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9yZXNvbHZlci9iaW5hcnlVbmFyeUV4cHIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsd0VBQXNFO0FBRXRFLFNBQWdCLGVBQWUsQ0FDN0IsUUFBa0IsRUFDbEIsSUFBMEI7SUFFMUIsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFL0IsTUFBTSxRQUFRLEdBQUksSUFBSSxDQUFDLFFBQXNCLENBQUMsWUFBWSxDQUFDO0lBQzNELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO0lBQ2xDLE1BQU0sU0FBUyxHQUFJLElBQUksQ0FBQyxTQUF1QixDQUFDLFlBQVksQ0FBQztJQUU3RCxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQztJQUU3QixRQUFRLFFBQVEsRUFBRTtRQUNoQixLQUFLLFFBQVEsQ0FBQyxDQUFDO1lBQ2IsUUFBUSxFQUFFLEVBQUU7Z0JBQ1YsS0FBSyxJQUFJLENBQUM7Z0JBQ1YsS0FBSyxJQUFJLENBQUMsQ0FBQztvQkFDVCxJQUNFLFNBQVMsSUFBSSxRQUFRO3dCQUNyQixTQUFTLElBQUksTUFBTTt3QkFDbkIsU0FBUyxJQUFJLE1BQU0sRUFDbkI7d0JBQ0EsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLG9DQUFvQyxDQUFDLENBQUM7d0JBQ3BFLE1BQU07cUJBQ1A7b0JBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7b0JBQzlCLE1BQU07aUJBQ1A7Z0JBQ0QsS0FBSyxHQUFHLENBQUMsQ0FBQztvQkFDUixNQUFNO2lCQUNQO2dCQUNELE9BQU8sQ0FBQyxDQUFDO29CQUNQLFFBQVEsQ0FBQyxRQUFR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