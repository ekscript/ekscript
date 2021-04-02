"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loopNamedNodeChild = exports.loopNodeChildren = void 0;
function* loopNodeChildren(node) {
    if (node != null) {
        for (let i = 0; i < node.childCount; i++)
            yield { i, child: node.children[i] };
    }
}
exports.loopNodeChildren = loopNodeChildren;
function* loopNamedNodeChild(node) {
    if (node != null) {
        for (let i = 0; i < node.namedChildCount; i++) {
            const child = node.namedChildren[i];
            yield { i, child: child };
        }
    }
}
exports.loopNamedNodeChild = loopNamedNodeChild;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlcmF0b3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL2l0ZXJhdG9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxRQUFlLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUF1QjtJQUN2RCxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7UUFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFO1lBQ3RDLE1BQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztLQUN4QztBQUNILENBQUM7QUFMRCw0Q0FLQztBQUVELFFBQWUsQ0FBQyxDQUFDLGtCQUFrQixDQUNqQyxJQUF1QjtJQUV2QixJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7UUFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDN0MsTUFBTSxLQUFLLEdBQWUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFVLEVBQUUsQ0FBQztTQUNoQztLQUNGO0FBQ0gsQ0FBQztBQVRELGdEQVNDIn0=