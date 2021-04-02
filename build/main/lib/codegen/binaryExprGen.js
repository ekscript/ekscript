"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitBinaryExpr = void 0;
function visitBinaryExpr(codegen, node) {
    const left = node.leftNode;
    const operator = node.operatorNode;
    const right = node.rightNode;
    if ((left === null || left === void 0 ? void 0 : left.type) == 'string') {
        codegen.addInclude('ekstr');
        let rightType = right === null || right === void 0 ? void 0 : right.type;
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
                let rightText = right === null || right === void 0 ? void 0 : right.text;
                const leftText = left.text.slice(1, left.text.length - 1);
                if (rightType == 'string' || rightType == 'char')
                    rightText = rightText.slice(1, rightText.length - 1);
                const finalValue = `"${leftText}${rightText}"`;
                const tempVar = `temp${codegen.numTempVars++}`;
                codegen.currentFunc.body.push(`${codegen.indent}const string ${tempVar} = init_string( ${finalValue}, ${finalValue.length - 2} ) ;`);
                codegen.currentScope.destructors[tempVar] = 'string';
                codegen.addCol(tempVar);
                break;
            }
            case 'parenthesized_expression':
            case 'identifier': {
                const identifierType = right.variableType;
                const tempVar = `temp${codegen.numTempVars++}`;
                const stringInit = `const string ${tempVar} = init_string( ${left.text}, ${left.text.length - 2} ) ;`;
                codegen.currentScope.destructors[tempVar] = 'string';
                codegen.currentFunc.body.push(codegen.indent + stringInit);
                codegen.addCol(`concat_string_${identifierType}( ${tempVar}, ${right === null || right === void 0 ? void 0 : right.text})`);
                break;
            }
            default: {
            }
        }
    }
    else {
        switch (operator.text) {
            case '+': {
                if (left.variableType == 'string' && right.variableType == 'string') {
                    if (right.type == 'string')
                        codegen.addCol('concat_string_char (');
                    else if (right.type == 'identifier')
                        codegen.addCol(')');
                    codegen.visit(left);
                    codegen.addCol(',');
                    codegen.visit(right);
                    codegen.addCol(')');
                }
                else {
                    codegen.visit(left);
                    codegen.addCol(operator.text);
                    codegen.visit(right);
                }
                break;
            }
            case '==': {
                if (left.variableType == 'string' && right.variableType == 'string') {
                    if (right.type == 'string')
                        codegen.addCol('compare_string_char (');
                    else if (right.type == 'identifier')
                        codegen.addCol(')');
                    codegen.visit(left);
                    codegen.addCol(',');
                    codegen.visit(right);
                    if (right.type == 'string')
                        codegen.addCol(`, ${right.text.length - 2}`);
                    codegen.addCol(')');
                }
                else {
                    codegen.visit(left);
                    codegen.addCol(operator.text);
                    codegen.visit(right);
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
exports.visitBinaryExpr = visitBinaryExpr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluYXJ5RXhwckdlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvY29kZWdlbi9iaW5hcnlFeHByR2VuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLFNBQWdCLGVBQWUsQ0FBQyxPQUFnQixFQUFFLElBQTBCO0lBQzFFLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFxQixDQUFDO0lBQ3hDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDbkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQXNCLENBQUM7SUFFMUMsSUFBSSxDQUFBLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxJQUFJLEtBQUksUUFBUSxFQUFFO1FBQzFCLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUIsSUFBSSxTQUFTLEdBQVcsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLElBQUssQ0FBQztRQUNyQyxRQUFRLFNBQVMsRUFBRTtZQUNqQixLQUFLLGFBQWEsQ0FBQztZQUNuQixhQUFhO1lBQ2IsS0FBSyxlQUFlLENBQUMsQ0FBQztnQkFDcEIsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDdEQ7WUFDRCxLQUFLLE1BQU0sQ0FBQztZQUNaLEtBQUssT0FBTyxDQUFDO1lBQ2IsS0FBSyxNQUFNLENBQUM7WUFDWixLQUFLLE1BQU0sQ0FBQztZQUNaLEtBQUssUUFBUSxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxTQUFTLEdBQUcsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLElBQUssQ0FBQztnQkFDN0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENB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