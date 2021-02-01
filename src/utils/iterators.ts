import { SyntaxNode } from 'tree-sitter-ekscript';

export function* loopNodeChildren(node: SyntaxNode | null) {
  if (node != null) {
    for (let i = 0; i < node.childCount; i++)
      yield { i, child: node.children[i] };
  }
}

export function* loopNamedNodeChild(node: SyntaxNode | null) {
  if (node != null) {
    for (let i = 0; i < node.namedChildCount; i++)
      yield { i, child: node.namedChildren[i] };
  }
}
