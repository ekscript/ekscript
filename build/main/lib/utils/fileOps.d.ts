export declare const getFile: (filePath: string) => string;
export declare const setFile: (filePath: string, fileContents: string) => void;
export declare const logFactory: (fileName: string, functionName?: string | undefined) => (...args: any[]) => void;
