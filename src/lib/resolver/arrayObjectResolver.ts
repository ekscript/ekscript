import {
    ArrayNode,
    SubVariableType,
    ObjectNode,
    ValueNode,
    PairNode,
} from 'tree-sitter-ekscript';
import Resolver from './index';
import { loopNamedNodeChild } from '../utils/iterators';
import {
    mirrorAnonNameInComplexTypes,
    compareVariableTypes,
} from '../utils/codegenResolverUtils';

import { logFactory } from '../utils/fileOps';
const log = logFactory(__filename);

/**
 * @param Resolver class instance
 * @param ArrayNode that is to be processed
 * @param generator flag for whether to generate array structs
 * */
export function visitArray(
    resolver: Resolver,
    node: ArrayNode,
    generator = false
) {
    node.variableType = 'array';
    const subVariableType: SubVariableType = {
        subTypes: [], // only the first index will hold any value of any kind
        variableType: 'array',
    };

    if (node.namedChildCount == 0) return; // if empty array, return

    const complexFieldTypes: SubVariableType[] = []; // this is specially relevant for tuples: later
    const stringFieldTypes = new Set<string>(); // basic types: int, float, string, boolean, null

    let generatorMod = generator;

    for (const { child, i } of loopNamedNodeChild(node)) {
        // if one of the child is an identifier, simply ignore
        if (child.type == 'identifier') {
            generatorMod = false;
        }
    }

    for (const { child, i } of loopNamedNodeChild(node)) {
        if (child.type == 'comment') continue;

        else if (child.type == 'array')
            visitArray(resolver, child as ArrayNode, generator);
        else if (child.type == 'object')
            resolver.visitObject(child as ObjectNode, i == 0 ? generatorMod : false);
        else resolver.visit(child);

        switch ((child as ValueNode).variableType) {
            case 'object':
            case 'array': {
                let isPresent = false;
                for (let i = 0; i < complexFieldTypes.length; i++) {
                    const varB = complexFieldTypes[i];
                    if (
                        compareVariableTypes(
                            (child as ValueNode).variableType,
                            (child as ValueNode).subVariableType,
                            varB.variableType,
                            varB
                        )
                    ) {
                        isPresent = true; // if type is present already in the array
                        break;
                    }
                }
                const subVarType = (child as ValueNode).subVariableType;
                // if subVarType is present, push the type to complexFieldTypes
                if (!isPresent && subVarType) complexFieldTypes.push(subVarType);
                break;
            }
            default: {
                // if the type is a basic type, int, string, float, boolean, null
                stringFieldTypes.add((child as ValueNode).variableType);
                break;
            }
        }
    }

    if (complexFieldTypes.length == 0 && stringFieldTypes.size == 0) return;

    // push this to the array finally
    complexFieldTypes.forEach((fT) => subVariableType.subTypes?.push(fT));
    for (const fT of stringFieldTypes) subVariableType.subTypes?.push(fT);

    const typeAlias = `anon_array${resolver.counter++}`;
    subVariableType.typeAlias = typeAlias;
    node.subVariableType = subVariableType;

    const subV = (node.firstNamedChild as ValueNode)?.subVariableType;
    if (subV != null) {
        for (const { child, i } of loopNamedNodeChild(node)) {
            if (i != 0) {
                const duplicates = mirrorAnonNameInComplexTypes(
                    subV,
                    (child as ValueNode).subVariableType
                );
                duplicates.forEach((dup) => {
                    resolver._generators.delete(dup)
                });
            }
        }
    }

    if (generator) resolver._generators.set(typeAlias, subVariableType);
}

/*
 * @param {resolver} Resolver class
 * @param {node}
 * @param {generator} flag for generating object structs
 * */
export function visitObject(
    resolver: Resolver,
    node: ObjectNode,
    generator = false
) {
    node.variableType = 'object';
    const subVariableType: SubVariableType = {
        subTypes: [],
        variableType: 'object',
        fields: {},
    };

    for (const { child } of loopNamedNodeChild(node)) {
        const { keyNode, valueNode } = child as PairNode;

        if (valueNode.type == 'array') {
            resolver.visitArray(valueNode as ArrayNode, generator);
        } else if (valueNode.type == 'object') {
            resolver.visitObject(valueNode as ObjectNode, generator);
        } else {
            resolver.visit(valueNode);
        }

        const varType = (valueNode as ValueNode).variableType;
        const subVarType = (valueNode as ValueNode).subVariableType;

        switch (varType) {
            case 'object':
            case 'array': {
                if (subVariableType.fields)
                    subVariableType.fields[keyNode.text] = subVarType;
                break;
            }
            default: {
                subVariableType.fields![keyNode.text] = varType;
                break;
            }
        }

        (child as ValueNode).variableType = varType;
        (child as ValueNode).subVariableType = (valueNode as ValueNode).subVariableType;
        (keyNode as ValueNode).variableType = varType;
        (keyNode as ValueNode).subVariableType = (valueNode as ValueNode).subVariableType;
    }

    // TODO: Work on resolving this with variable declaration
    const typeAlias = `anon_object${resolver.counter++}`;

    if (generator) resolver._generators.set(typeAlias, subVariableType);
    subVariableType.typeAlias = typeAlias;

    node.subVariableType = subVariableType;
}
