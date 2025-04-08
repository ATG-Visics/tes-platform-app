import { JsonSchema7 } from '@jsonforms/core';

export const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    hazard: {
      type: 'string',
    },
    isOverloaded: {
      type: 'boolean',
    },
    sample: {
      type: 'string',
    },
    method: {
      type: 'string',
    },
    twaResult: {
      type: 'string',
    },
    sampleResult: {
      type: ['null', 'string'],
    },
    volume: {
      type: 'string',
    },
    total: {
      type: 'string',
    },
    oel: {
      type: 'string',
    },
    lodSr2: {
      type: ['null', 'string'],
    },
    unit: {
      type: 'string',
    },
    al: {
      type: ['null', 'string'],
    },
    totalMass: {
      type: 'string',
    },
    totalMassUnit: {
      type: 'string',
    },
    isLessThan: {
      type: ['null', 'string'],
      oneOf: [
        { const: null, title: '' },
        { const: '<', title: '<' },
      ],
    },
    isLessThanTwa: {
      type: ['null', 'string'],
      oneOf: [
        { const: null, title: '' },
        { const: '<', title: '<' },
      ],
    },
  },
  required: [
    'method',
    'volume',
    'total',
    'oel',
    'totalMass',
    'twaResult',
    'unit',
  ],
};
