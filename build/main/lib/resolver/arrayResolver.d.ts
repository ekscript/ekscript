import { ArrayNode } from 'tree-sitter-ekscript';
import Resolver from './index';
/**
  * @param {resolver} Resolver class instance
  * @param {node} ArrayNode that is to be processed
  * @param {generator} flag for whether to generate array or not
  *                     usuallly is false when duplicate
  *                     array structs are to be made
  * */
export declare function visitArray(resolver: Resolver, node: ArrayNode, generator?: boolean): void;
