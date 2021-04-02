"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logFactory = exports.setFile = exports.getFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getFile = (filePath) => {
    const file = fs_1.default.readFileSync(path_1.default.resolve('.', filePath)).toString();
    return file;
};
exports.getFile = getFile;
const setFile = (filePath, fileContents) => {
    try {
        fs_1.default.writeFileSync(filePath, fileContents);
    }
    catch (e) {
        console.error(e);
    }
};
exports.setFile = setFile;
const logFactory = (fileName, functionName) => {
    return (...args) => console.log('\x1b[34m', path_1.default.basename(fileName), functionName ? `> ${functionName}` : '', '\x1b[0m >', ...args);
};
exports.logFactory = logFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZU9wcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvdXRpbHMvZmlsZU9wcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0Q0FBb0I7QUFDcEIsZ0RBQXdCO0FBRWpCLE1BQU0sT0FBTyxHQUFHLENBQUMsUUFBZ0IsRUFBRSxFQUFFO0lBQzFDLE1BQU0sSUFBSSxHQUFHLFlBQUUsQ0FBQyxZQUFZLENBQUMsY0FBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNyRSxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUhXLFFBQUEsT0FBTyxXQUdsQjtBQUVLLE1BQU0sT0FBTyxHQUFHLENBQUMsUUFBZ0IsRUFBRSxZQUFvQixFQUFFLEVBQUU7SUFDaEUsSUFBSTtRQUNGLFlBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0tBQzFDO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xCO0FBQ0gsQ0FBQyxDQUFDO0FBTlcsUUFBQSxPQUFPLFdBTWxCO0FBRUssTUFBTSxVQUFVLEdBQUcsQ0FBQyxRQUFnQixFQUFFLFlBQXFCLEVBQUUsRUFBRTtJQUNwRSxPQUFPLENBQUMsR0FBRyxJQUFXLEVBQUUsRUFBRSxDQUN4QixPQUFPLENBQUMsR0FBRyxDQUNULFVBQVUsRUFDVixjQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUN2QixZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFDdkMsV0FBVyxFQUNYLEdBQUcsSUFBSSxDQUNSLENBQUM7QUFDTixDQUFDLENBQUM7QUFUVyxRQUFBLFVBQVUsY0FTckIifQ==