import { rules } from './schemaRules';

export const uiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      label: 'Sample details',
      elements: [
        {
          type: 'Control',
          label: 'Sample ID',
          scope: '#/properties/sampleId',
        },
        {
          type: 'Control',
          label: 'Sampler name',
          scope: '#/properties/sampler',
        },
        {
          type: 'Control',
          label: 'Use sample scenario',
          scope: '#/properties/useSamplingPlan',
          options: {
            format: 'radio',
          },
        },
      ],
    },
    {
      type: 'SamplingPlanSelectControl',
      scope: '#/properties/samplingPlan',
      rule: {
        effect: 'HIDE',
        condition: {
          scope: '#',
          schema: {
            properties: {
              useSamplingPlan: { const: 'noSamplingPlan' },
            },
          },
        },
      },
    },
    {
      type: 'Group',
      label: 'Sample type',
      elements: [
        {
          type: 'Control',
          label: false,
          scope: '#/properties/type',
          options: {
            format: 'radio',
          },
          rule: rules.disableForSamplingPlan,
        },
      ],
    },
    {
      type: 'Group',
      label: 'Sampling Equipment',
      elements: [
        {
          type: 'SampleMediaControl',
          label: 'Sample media',
          scope: '#/properties/medium',
          rule: rules.disableForSamplingPlan,
        },
        {
          type: 'Control',
          label: 'Sample media Serial number/identifier',
          scope: '#/properties/mediumSerialNumber',
        },
        {
          type: 'InstrumentsControl',
          label: 'Instrument',
          scope: '#/properties/instrument',
        },
        {
          type: 'CalibrationInstrumentsControl',
          label: 'Instrument calibrated using',
          scope: '#/properties/calibratedWith',
        },
      ],
    },
    {
      type: 'Group',
      elements: [
        {
          type: 'HazardListControl',
          label: 'Hazards of concern',
          scope: '#/properties/hazards',
        },
      ],
      rule: rules.notUsingSamplingPlan,
    },
    {
      type: 'Group',
      elements: [
        {
          type: 'HazardListSelectControl',
          label: 'Hazards of concern',
          scope: '#/properties/hazardScenarios',
        },
      ],
      rule: rules.samplePlanSelected,
    },
    {
      type: 'Group',
      label: 'Measurements data',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              label: 'Start time',
              scope: '#/properties/startTime',
              options: {
                format: 'time',
                ampm: true,
                clearLabel: 'Clear it!',
                cancelLabel: 'Abort',
                okLabel: 'Do it',
              },
            },
          ],
        },
        {
          type: 'Control',
          label: 'Initial calibration" (dBA)',
          scope: '#/properties/initialFlowRate',
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/chemical',
              schema: {
                const: false,
              },
            },
          },
        },
        {
          type: 'InputAdornment',
          label: 'Initial Flowrate',
          scope: '#/properties/initialFlowRate',
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/chemical',
              schema: {
                const: true,
              },
            },
          },
          options: {
            endAdornment: 'L/min',
            endAdornmentFormat: 'plaintext',
          },
        },
        {
          type: 'Control',
          scope: '#/properties/twaCalculationMethod',
          label: 'TWA Calculation Method',
          options: {
            format: 'radio',
          },
        },
      ],
    },
  ],
};
