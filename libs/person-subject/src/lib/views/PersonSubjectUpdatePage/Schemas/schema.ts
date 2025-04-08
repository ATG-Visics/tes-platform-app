import { JsonSchema7 } from '@jsonforms/core';

export const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    employeeNumber: {
      type: 'string',
    },
    shiftLength: {
      type: 'number',
    },
    samplingPlan: {
      type: 'string',
    },
    jobTitle: {
      type: 'string',
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
    exposureControls: {
      type: 'string',
    },
    exposureControlsOther: {
      type: 'string',
    },
    clothing: {
      type: 'array',
      minItems: 1,
      default: [],
      items: {
        type: 'string',
      },
      uniqueItems: true,
    },
    clothingOther: {
      type: 'string',
    },
    respirator: {
      type: 'array',
      minItems: 1,
      default: [],
      items: {
        type: 'string',
      },
      uniqueItems: true,
    },
    respiratorFilters: {
      type: 'string',
    },
    gloves: {
      type: 'array',
      minItems: 1,
      default: [],
      items: {
        type: 'string',
      },
      uniqueItems: true,
    },
    glovesOther: {
      type: 'string',
    },
    boots: {
      type: 'array',
      minItems: 1,
      default: [],
      items: {
        type: 'string',
      },
      uniqueItems: true,
    },
    bootsOther: {
      type: 'string',
    },
    eyeWear: {
      type: 'array',
      minItems: 1,
      default: [],
      items: {
        type: 'string',
      },
      uniqueItems: true,
    },
    eyeWearOther: {
      type: 'string',
    },
    hearingProtection: {
      type: 'array',
      minItems: 1,
      default: [],
      items: {
        type: 'string',
      },
      uniqueItems: true,
    },
    hearingProtectionOther: {
      type: 'string',
    },
    noiseReductionRating: {
      type: 'number',
    },
    headProtection: {
      type: 'array',
      minItems: 1,
      default: [],
      items: {
        type: 'string',
      },
      uniqueItems: true,
    },
    headProtectionOther: {
      type: 'string',
    },
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
  },
  required: ['title', 'jobTitle', 'shiftLength'],
};
