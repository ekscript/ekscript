"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCodeTree = void 0;
const tree_sitter_1 = __importDefault(require("tree-sitter"));
const tree_sitter_c_1 = __importDefault(require("tree-sitter-c"));
const parser = new tree_sitter_1.default();
parser.setLanguage(tree_sitter_c_1.default);
const getCodeTree = (code) => parser.parse(code).rootNode.toString();
exports.getCodeTree = getCodeTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29kZWdlbi91dGlscy9taXNjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhEQUFtQztBQUNuQyxrRUFBZ0M7QUFFaEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBUSxFQUFFLENBQUM7QUFDOUIsTUFBTSxDQUFDLFdBQVcsQ0FBQyx1QkFBRyxDQUFDLENBQUM7QUFFakIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRSxDQUMxQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUQ1QixRQUFBLFdBQVcsZUFDaUIifQ==