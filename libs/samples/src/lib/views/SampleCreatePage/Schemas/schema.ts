import { JsonSchema7 } from '@jsonforms/core';

export const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    sampleId: {
      type: 'string',
    },
    samplingPlan: {
      type: ['string', 'null'],
    },
    useSamplingPlan: {
      type: 'string',
      oneOf: [
        { const: 'samplingPlan', title: 'Use the sample scenario' },
        { const: 'noSamplingPlan', title: 'Do not use the sample scenario' },
      ],
      default: 'use-scenario',
    },
    type: {
      type: 'string',
      oneOf: [
        { const: 'full shift', title: 'Full shift' },
        { const: 'excursion', title: 'Excursion' },
        { const: 'short term', title: ' Short Term' },
        { const: 'grab sample', title: ' Grab sample' },
      ],
    },
    instrument: {
      type: 'object',
    },
    medium: {
      type: 'object',
    },
    mediumSerialNumber: {
      type: 'string',
    },
    calibratedWith: {
      type: 'object',
    },
    sampler: {
      type: 'string',
    },
    surveyMoment: {
      type: 'object',
    },
    hazards: {
      type: 'array',
      items: {
        type: ['string', 'object'],
      },
      minItems: 1,
      default: [],
    },
    noise: {
      type: 'object',
      properties: {
        acghiNoishDba: {
          type: 'string',
        },
        acghiNoishDose: {
          type: 'string',
        },
        oshaHcpDba: {
          type: 'string',
        },
        oshaHcpDose: {
          type: 'string',
        },
        oshaPelDba: {
          type: 'string',
        },
        oshaPelDose: {
          type: 'string',
        },
      },
    },
    notApplicableAcghiNoish: {
      type: 'boolean',
    },
    notApplicableOshaHcp: {
      type: 'boolean',
    },
    notApplicableOshaPel: {
      type: 'boolean',
    },
    startTime: {
      type: ['string', 'null'],
    },
    initialFlowRate: {
      type: ['null', 'string'],
    },
    chemical: {
      type: 'boolean',
    },
    twaCalculationMethod: {
      type: 'string',
    },
  },
  required: ['sampleId', 'twaCalculationMethod', 'hazards'],
};
