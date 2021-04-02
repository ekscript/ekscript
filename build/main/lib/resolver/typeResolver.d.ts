/**
* ====================
* Resolves the types
* ====================
* */
import Resolver from './index';
import { ObjectTypeNode, TypeAliasDeclarationNode, TypeAnnotationNode, ArrayTypeNode } from 'tree-sitter-ekscript';
export declare function visitObjectType(resolver: Resolver, node: ObjectTypeNode, generator?: boolean): void;
export declare function visitArrayType(resolver: Resolver, node: ArrayTypeNode, generator?: boolean): void;
/**
 * Resolves the type annotation node
 * @param node The TypeAnnotationNode
 * @param generator Whether to generate the sub nodes
 **/
export declare function visitTypeAnnotation(resolver: Resolver, node: TypeAnnotationNode, generator?: boolean): void;
export declare function visitTypeAliasDeclaration(resolver: Resolver, node: TypeAliasDeclarationNode): void;
