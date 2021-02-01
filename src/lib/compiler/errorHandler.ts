import { int } from '../../global.d';
import { TCompilerError } from '../../types/compiler.d';

export enum TCompilerErrorType {
  RUNTIME_ERROR,
  COMPILE_ERROR,
}

export const printErrors = (errors: TCompilerError[]) => {
  errors.forEach((error) => {
    if (error.errorType == TCompilerErrorType.COMPILE_ERROR)
      console.error('====== COMPILATION ERROR ======');
    else console.error('====== RUNTIME ERROR ======');

    console.error(`[${error.line}:${error.pos}] ${error.errorMessage}`);
  });
};

export const printWarnings = (warnings: TCompilerError[]) => {
  warnings.forEach((error) => {
    if (error.errorType == TCompilerErrorType.COMPILE_ERROR) {
      console.error('====== COMPILATION WARNING ======');
    } else {
      console.error('====== RUNTIME WARNING ======');
    }

    console.error(`[${error.line}:${error.pos}] ${error.errorMessage}`);
  });
};

export function newError(
  errorType: TCompilerErrorType,
  errorMessage: string,
  line: int,
  pos: int
): TCompilerError {
  return {
    errorType,
    errorMessage,
    line,
    pos,
  };
}
