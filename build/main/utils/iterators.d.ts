import { SyntaxNode } from 'tree-sitter-ekscript';
export declare function loopNodeChildren(node: SyntaxNode | null): Generator<{
    i: number;
    child: SyntaxNode;
}, void, unknown>;
export declare function loopNamedNodeChild<T extends SyntaxNode = SyntaxNode>(node: SyntaxNode | null): Generator<{
    i: number;
    child: T;
}, void, unknown>;
