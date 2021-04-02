import { BinaryExpressionNode, UnaryExpressionNode } from 'tree-sitter-ekscript';
import Resolver from './index';
export declare function visitBinaryExpr(resolver: Resolver, node: BinaryExpressionNode): void;
export declare function visitUnaryExpr(resolver: Resolver, node: UnaryExpressionNode): void;
