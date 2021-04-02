"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFile = exports.getFile = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZU9wcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9maWxlT3BzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDRDQUFvQjtBQUNwQixnREFBd0I7QUFFakIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxRQUFnQixFQUFFLEVBQUU7SUFDMUMsTUFBTSxJQUFJLEdBQUcsWUFBRSxDQUFDLFlBQVksQ0FBQyxjQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3JFLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDO0FBSFcsUUFBQSxPQUFPLFdBR2xCO0FBRUssTUFBTSxPQUFPLEdBQUcsQ0FBQyxRQUFnQixFQUFFLFlBQW9CLEVBQUUsRUFBRTtJQUNoRSxJQUFJO1FBQ0YsWUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7S0FDMUM7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7QUFDSCxDQUFDLENBQUM7QUFOVyxRQUFBLE9BQU8sV0FNbEIifQ==