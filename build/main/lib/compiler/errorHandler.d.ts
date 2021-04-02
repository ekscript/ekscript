import { int } from '../../global.d';
import { TCompilerError } from '../../types/compiler';
export declare enum TCompilerErrorType {
    RUNTIME_ERROR = 0,
    COMPILE_ERROR = 1
}
export declare const printErrors: (errors: TCompilerError[]) => void;
export declare const printWarnings: (warnings: TCompilerError[]) => void;
export declare function newError(errorType: TCompilerErrorType, errorMessage: string, line: int, pos: int): TCompilerError;
