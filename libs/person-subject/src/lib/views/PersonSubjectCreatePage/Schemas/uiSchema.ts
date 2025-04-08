export const uiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      elements: [
        {
          type: 'Control',
          label: 'Employee name',
          scope: '#/properties/title',
        },
        {
          type: 'Control',
          label: 'Employee ID',
          scope: '#/properties/employeeNumber',
        },
        {
          type: 'Control',
          label: '',
          scope: '#/properties/useSamplingPlan',
          options: {
            format: 'radio',
          },
        },
        {
          type: 'SelectJobTitleControl',
          label: '',
          scope: '#/properties',
          rule: {
            effect: 'HIDE',
            condition: {
              scope: '#/properties/useSamplingPlan',
              schema: {
                const: 'noSamplingPlan',
              },
            },
          },
        },
        {
          type: 'Control',
          label: 'Job title',
          scope: '#/properties/jobTitle',
        },
        {
          type: 'InputAdornment',
          label: 'Shift length',
          scope: '#/properties/shiftLength',
          options: {
            endAdornment: 'hours',
          },
        },
      ],
    },
    {
      type: 'Group',
      label: 'Environment info',
      elements: [
        {
          type: 'ControlWithOther',
          label: 'Work environment (if applicable)',
          scope: '#/properties/workEnvironment',
          options: {
            otherApiName: 'workEnvironmentOther',
          },
        },
        {
          type: 'Control',
          label: 'Ventilation (if applicable)',
          scope: '#/properties/ventilation',
        },
        {
          type: 'WeldingControl',
          label: 'Welding process (if applicable)',
          scope: '#/properties/weldingProcess',
          options: {
            extraFields: [
              {
                label: 'Metal welded',
                path: 'metal',
                type: 'select',
              },
              {
                label: 'Electrode (for welding)',
                path: 'electrode',
                type: 'string',
              },
            ],
          },
        },
        {
          type: 'Control',
          label: 'Sample Condition (based on the subjects opinion)',
          scope: '#/properties/samplingConditions',
        },
        {
          type: 'Control',
          label: 'Unusual condition (if applicable)',
          scope: '#/properties/unusualConditions',
        },
        {
          type: 'ControlWithOther',
          label: 'Exposure control (if applicable)',
          scope: '#/properties/exposureControls',
          options: {
            otherApiName: 'exposureControlsOther',
          },
        },
      ],
    },
    {
      type: 'Group',
      label: 'PPE info',
      elements: [
        {
          type: 'DynamicMultiControlWithOther',
          label: 'Clothing',
          scope: '#/properties/clothing',
          options: {
            otherApiName: 'clothingOther',
            mutuallyExclusiveOptions: ['none observed', 'n/a'],
          },
        },
        {
          type: 'RespiratorControl',
          label: 'Respirator',
          scope: '#/properties/respirator',
          options: {
            mutuallyExclusiveOptions: ['none observed', 'n/a'],
          },
        },
        {
          type: 'DynamicMultiControlWithOther',
          label: 'Gloves',
          scope: '#/properties/gloves',
          options: {
            otherApiName: 'glovesOther',
            mutuallyExclusiveOptions: ['n/a'],
          },
        },
        {
          type: 'DynamicMultiControlWithOther',
          label: 'Boots',
          scope: '#/properties/boots',
          options: {
            otherApiName: 'bootsOther',
          },
        },
        {
          type: 'DynamicMultiControlWithOther',
          label: 'Eye wear',
          scope: '#/properties/eyeWear',
          options: {
            otherApiName: 'eyeWearOther',
            mutuallyExclusiveOptions: ['none observed', 'n/a'],
          },
        },
        {
          type: 'HearingProtectionControl',
          label: 'Hearing protection category',
          scope: '#/properties/hearingProtection',
          options: {
            mutuallyExclusiveOptions: ['none observed', 'n/a'],
          },
        },
        {
          type: 'DynamicMultiControlWithOther',
          label: 'Head protection',
          scope: '#/properties/headProtection',
          options: {
            otherApiName: 'headProtectionOther',
            mutuallyExclusiveOptions: ['none observed', 'n/a'],
          },
        },
      ],
    },
  ],
};
