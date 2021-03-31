declare global {
  export type char = string;
  export type int = number;
  export type float = number;
  export type EkObj = Record<string, any>;
  export type EkArr<T> = readonly T[];
  export type logFactory = (fileName: string, functionName?: string) => void;
}
