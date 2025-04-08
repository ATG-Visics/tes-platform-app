import { JsonSchema7 } from '@jsonforms/core';

export const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    endTime: {
      type: 'string',
    },
    finalFlowRate: {
      type: 'string',
    },
    isChemical: {
      type: 'boolean',
    },
  },
};
