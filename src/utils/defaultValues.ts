import { IVarKind } from 'tree-sitter-ekscript';

export enum VarKind {
  variable = IVarKind.variable,
  typeDef = IVarKind.typeDef,
}
