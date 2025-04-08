import { JsonSchema7 } from '@jsonforms/core';

export const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    calibrationInstrumentSet: {
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
  required: ['title'],
};
