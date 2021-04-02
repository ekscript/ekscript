"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgs = void 0;
const fileOps_1 = require("../utils/fileOps");
function parseArgs() {
    const filePath = process.argv.slice(1)[0];
    return {
        filePath,
        fileContent: fileOps_1.getFile(filePath),
    };
}
exports.parseArgs = parseArgs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VBcmdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaS9wYXJzZUFyZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsOENBQTJDO0FBRTNDLFNBQWdCLFNBQVM7SUFDdkIsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsT0FBTztRQUNMLFFBQVE7UUFDUixXQUFXLEVBQUUsaUJBQU8sQ0FBQyxRQUFRLENBQUM7S0FDL0IsQ0FBQztBQUNKLENBQUM7QUFORCw4QkFNQyJ9