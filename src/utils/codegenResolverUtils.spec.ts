import test from 'ava';
import { SubVariableType } from 'tree-sitter-ekscript';

import {
  compareVariableTypes,
  mirrorAnonNameInComplexTypes,
} from './codegenResolverUtils';

test('compare arrays...', (t) => {
  t.is(
    compareVariableTypes(
      'array',
      {
        variableType: 'array',
        subTypes: [
          {
            variableType: 'array',
            subTypes: ['int'],
          },
        ],
      },
      'array',
      {
        variableType: 'array',
        subTypes: [
          {
            variableType: 'array',
            subTypes: ['int'],
          },
        ],
      }
    ),
    true
  );
});

test('compare objects...', (t) => {
  t.is(
    compareVariableTypes(
      'object',
      {
        variableType: 'object',
        subTypes: [],
        fields: {
          name: 'int',
          hey: {
            variableType: 'array',
            subTypes: ['int'],
          },
          yo: 'int',
        },
      },
      'object',
      {
        variableType: 'object',
        subTypes: [],
        fields: {
          name: 'int',
          yo: 'int',
          hey: {
            variableType: 'array',
            subTypes: ['int'],
          },
        },
      }
    ),
    true
  );
  t.is(
    compareVariableTypes(
      'object',
      {
        variableType: 'object',
        subTypes: [],
        fields: {
          hey: {
            variableType: 'array',
            subTypes: ['int'],
          },
        },
      },
      'object',
      {
        variableType: 'object',
        subTypes: [],
        fields: {
          hey: {
            variableType: 'array',
            subTypes: ['string'],
          },
        },
      }
    ),
    false
  );
});

test('Mirror subVariableType...', (t) => {
  const src: SubVariableType = {
    variableType: 'object',
    subTypes: [],
    fields: {
      name1: {
        variableType: 'object',
        subTypes: [],
        fields: {
          arr: {
            variableType: 'array',
            subTypes: [
              'string',
              {
                variableType: 'array',
                subTypes: ['string'],
                typeAlias: 'anon_name131d',
              },
            ],
            typeAlias: 'anon_name611',
          },
          name: 'int',
        },
        typeAlias: 'anon_name1',
      },
    },
    typeAlias: 'anon_name_0',
  };
  const des: SubVariableType = {
    variableType: 'object',
    subTypes: [],
    fields: {
      name1: {
        variableType: 'object',
        subTypes: [],
        fields: {
          arr: {
            variableType: 'array',
            subTypes: [
              'string',
              {
                variableType: 'array',
                subTypes: ['string'],
                typeAlias: 'anon_name131d',
              },
            ],
            typeAlias: 'anon_name66',
          },
          name: 'int',
        },
        typeAlias: 'anon_name_5',
      },
    },
    typeAlias: 'anon_name_4',
  };

  mirrorAnonNameInComplexTypes(src, des);
  t.is(JSON.stringify(des), JSON.stringify(src));
});
