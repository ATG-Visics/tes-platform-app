import { JsonSchema7 } from '@jsonforms/core';

export const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    // Step 1
    title: { type: 'string', title: 'Scenario title' },
    subjectType: {
      type: 'string',
      oneOf: [
        {
          const: 'area',
          title: 'Area subject',
        },
        {
          const: 'person',
          title: 'Person subject',
        },
      ],
    },
    jobTitle: { type: 'string', title: 'Job Title' },
    shiftLength: { type: 'number', title: 'Shift Length' },
    taskDescription: { type: 'string', title: 'Task Description' },

    // Step 2
    sampleType: {
      type: 'string',
      oneOf: [
        { const: 'full shift', title: 'Full shift' },
        { const: 'excursion', title: 'Excursion' },
        { const: 'short term', title: ' Short Term' },
        { const: 'grab sample', title: ' Grab sample' },
      ],
    },

    // Step 3
    media: { type: 'object', title: 'Medium' },
    hazardScenarios: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          hazard: { type: ['string', 'object'] },
          oel: { type: 'string', title: 'OEL' },
          oelSource: { type: 'string', title: 'OEL Source' },
          targetSampleCount: { type: 'number', title: 'targetSampleCount' },
          unit: { type: 'string', title: 'Unit' },
          analyticalMethod: { type: 'string', title: 'Analytical Method' },
          actionLevel: { type: 'string', title: 'Action' },
          actionLevelSource: {
            type: ['string', 'null'],
          },
        },
        required: ['hazard', 'targetSampleCount'],
      },
      minItems: 1,
      default: [],
    },
  },
  required: ['title', 'sampleType', 'media', 'jobTitle', 'shiftLength'],
};
