export const rules = {
  useSamplingPlanSelected: {
    effect: 'SHOW',
    condition: {
      scope: '#/properties/useSamplingPlan',
      schema: {
        const: 'samplingPlan',
      },
    },
  },
  notUsingSamplingPlan: {
    effect: 'SHOW',
    condition: {
      scope: '#/properties/useSamplingPlan',
      schema: {
        const: 'noSamplingPlan',
      },
    },
  },
  samplePlanSelected: {
    effect: 'SHOW',
    condition: {
      scope: '#',
      schema: {
        properties: {
          samplingPlan: {
            not: {
              const: null,
            },
          },
        },
        required: ['samplingPlan'],
      },
    },
  },
  noSamplingPlanSelected: {
    effect: 'SHOW',
    condition: {
      scope: '#',
      schema: {
        properties: {
          samplingPlan: {
            const: 'string',
          },
        },
      },
    },
  },
  samplingPlanSelectedOrNoSamplingPlan: {
    effect: 'SHOW',
    condition: {
      scope: '#',
      schema: {
        anyOf: [
          {
            properties: {
              samplingPlan: {
                not: {
                  const: null,
                },
              },
            },
            required: ['samplingPlan'],
          },
        ],
      },
    },
  },
  disableForSamplingPlan: {
    effect: 'DISABLE',
    condition: {
      scope: '#',
      schema: {
        properties: {
          samplingPlan: {
            not: {
              const: null,
            },
          },
        },
        required: ['samplingPlan'],
      },
    },
  },
};
