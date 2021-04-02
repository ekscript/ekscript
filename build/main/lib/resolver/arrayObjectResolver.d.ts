import { ArrayNode, ObjectNode } from 'tree-sitter-ekscript';
import Resolver from './index';
/**
 * @param Resolver class instance
 * @param ArrayNode that is to be processed
 * @param generator flag for whether to generate array structs
 * */
export declare function visitArray(resolver: Resolver, node: ArrayNode, generator?: boolean): void;
export declare function visitObject(resolver: Resolver, node: ObjectNode, generator?: boolean): void;
