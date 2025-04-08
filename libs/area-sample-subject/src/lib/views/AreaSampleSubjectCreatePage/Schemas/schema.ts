import { JsonSchema7 } from '@jsonforms/core';

export const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    useSamplingPlan: {
      type: 'string',
      oneOf: [
        {
          const: 'samplingPlan',
          title: 'Use a sampling plan scenario',
        },
        {
          const: 'noSamplingPlan',
          title: 'Create new sample',
        },
      ],
      default: 'samplingPlan',
    },
    title: {
      type: 'string',
    },
    surveyMoment: {
      type: 'object',
    },
    chemicals: {
      type: 'boolean',
    },
    workEnvironment: {
      type: 'string',
    },
    workEnvironmentOther: {
      type: 'string',
    },
    ventilation: {
      type: 'string',
    },
    weldingProcess: {
      type: 'string',
    },
    metal: {
      type: 'string',
    },
    electrode: {
      type: 'string',
    },
    samplingConditions: {
      type: 'string',
    },
    unusualConditions: {
      type: 'string',
    },
    samplingPlan: {
      type: ['string', 'null'],
    },
  },
  required: ['title'],
};
