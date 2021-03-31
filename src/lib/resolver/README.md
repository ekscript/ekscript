# Resolver resolves all the nodes of the AST

The entry module to the resolver to the EkScript compiler is
[index.ts](./index.ts).

A few resolvers are writen as separate files so as to modularize
the monolithic Resolver class:

1. [typeResolver](./typeResolver.ts): Resolves type based nodes 
2. [arrayResolver](./arrayObjectResolver): Resolves arrays and objects
3. [variableDecl](./variableDecl.ts): Resolves Variable Declarations
4. [exprResolver](./exprResolver.ts): Resolves Expressions

