import { TCompilerSource } from '../types/compiler';
import { getFile } from '../utils/fileOps';

export function parseArgs(): TCompilerSource {
  const filePath = process.argv.slice(1)[0];
  return {
    filePath,
    fileContent: getFile(filePath),
  };
}
