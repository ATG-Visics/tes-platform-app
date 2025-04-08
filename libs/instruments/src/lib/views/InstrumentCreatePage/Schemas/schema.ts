import { JsonSchema7 } from '@jsonforms/core';

export const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    instrumentType: {
      type: 'string',
      oneOf: [
        {
          const: 'chemical',
          title: 'Chemical/Dust/Fiber/Fume',
        },
        {
          const: 'noise',
          title: 'Noise',
        },
      ],
    },
    instrumentSet: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          serialNumber: {
            type: 'string',
          },
        },
      },
    },
  },
  required: ['title', 'instrumentType'],
};
