"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newError = exports.printWarnings = exports.printErrors = exports.TCompilerErrorType = void 0;
var TCompilerErrorType;
(function (TCompilerErrorType) {
    TCompilerErrorType[TCompilerErrorType["RUNTIME_ERROR"] = 0] = "RUNTIME_ERROR";
    TCompilerErrorType[TCompilerErrorType["COMPILE_ERROR"] = 1] = "COMPILE_ERROR";
})(TCompilerErrorType = exports.TCompilerErrorType || (exports.TCompilerErrorType = {}));
const printErrors = (errors) => {
    errors.forEach((error) => {
        if (error.errorType == TCompilerErrorType.COMPILE_ERROR)
            console.error('====== COMPILATION ERROR ======');
        else
            console.error('====== RUNTIME ERROR ======');
        console.error(`[${error.line}:${error.pos}] ${error.errorMessage}`);
    });
};
exports.printErrors = printErrors;
const printWarnings = (warnings) => {
    warnings.forEach((error) => {
        if (error.errorType == TCompilerErrorType.COMPILE_ERROR) {
            console.error('====== COMPILATION WARNING ======');
        }
        else {
            console.error('====== RUNTIME WARNING ======');
        }
        console.error(`[${error.line}:${error.pos}] ${error.errorMessage}`);
    });
};
exports.printWarnings = printWarnings;
function newError(errorType, errorMessage, line, pos) {
    return {
        errorType,
        errorMessage,
        line,
        pos,
    };
}
exports.newError = newError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21waWxlci9lcnJvckhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0EsSUFBWSxrQkFHWDtBQUhELFdBQVksa0JBQWtCO0lBQzVCLDZFQUFhLENBQUE7SUFDYiw2RUFBYSxDQUFBO0FBQ2YsQ0FBQyxFQUhXLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBRzdCO0FBRU0sTUFBTSxXQUFXLEdBQUcsQ0FBQyxNQUF3QixFQUFFLEVBQUU7SUFDdEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1FBQ3ZCLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQyxhQUFhO1lBQ3JELE9BQU8sQ0FBQyxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQzs7WUFDOUMsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBRWxELE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7SUFDdEUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFSVyxRQUFBLFdBQVcsZUFRdEI7QUFFSyxNQUFNLGFBQWEsR0FBRyxDQUFDLFFBQTBCLEVBQUUsRUFBRTtJQUMxRCxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7UUFDekIsSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLGtCQUFrQixDQUFDLGFBQWEsRUFBRTtZQUN2RCxPQUFPLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7U0FDcEQ7YUFBTTtZQUNMLE9BQU8sQ0FBQyxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztTQUNoRDtRQUVELE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7SUFDdEUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFWVyxRQUFBLGFBQWEsaUJBVXhCO0FBRUYsU0FBZ0IsUUFBUSxDQUN0QixTQUE2QixFQUM3QixZQUFvQixFQUNwQixJQUFTLEVBQ1QsR0FBUTtJQUVSLE9BQU87UUFDTCxTQUFTO1FBQ1QsWUFBWTtRQUNaLElBQUk7UUFDSixHQUFHO0tBQ0osQ0FBQztBQUNKLENBQUM7QUFaRCw0QkFZQyJ9