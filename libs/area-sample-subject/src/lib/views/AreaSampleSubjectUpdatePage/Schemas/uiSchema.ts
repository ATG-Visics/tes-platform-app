export const uiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      label: 'Location name',
      scope: '#/properties/title',
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
      label: 'Description',
      scope: '#/properties/taskDescription',
      options: {
        multi: true,
      },
    },
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
  ],
};
