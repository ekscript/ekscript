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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlcmF0b3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi91dGlscy9pdGVyYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsUUFBZSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsSUFBdUI7SUFDdkQsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO1FBQ2hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRTtZQUN0QyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7S0FDeEM7QUFDSCxDQUFDO0FBTEQsNENBS0M7QUFFRCxRQUFlLENBQUMsQ0FBQyxrQkFBa0IsQ0FDakMsSUFBdUI7SUFFdkIsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO1FBQ2hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzdDLE1BQU0sS0FBSyxHQUFlLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBVSxFQUFFLENBQUM7U0FDaEM7S0FDRjtBQUNILENBQUM7QUFURCxnREFTQyJ9