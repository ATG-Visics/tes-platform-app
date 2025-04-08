export const uiSchemaHeader = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      label: 'Overloaded',
      scope: '#/properties/isOverloaded',
    },
  ],
};

export const uiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          label: 'Is less than for sample result',
          scope: '#/properties/isLessThan',
        },
        {
          type: 'Control',
          label: 'Sample result',
          scope: '#/properties/sampleResult',
        },
        {
          type: 'Control',
          scope: '#/properties/unit',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          label: 'Is less than for TWA',
          scope: '#/properties/isLessThanTwa',
        },
        {
          type: 'Control',
          label: 'TWA result',
          scope: '#/properties/twaResult',
        },
        {
          type: 'Control',
          scope: '#/properties/unit',
          options: {
            readonly: true,
          },
        },
      ],
    },
    {
      type: 'Control',
      label: 'Analytical method',
      scope: '#/properties/method',
    },
    {
      type: 'Control',
      label: 'Volume (liters)',
      scope: '#/properties/volume',
    },
    {
      type: 'Control',
      label: 'Total time (minutes)',
      scope: '#/properties/total',
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          label: 'Action level',
          scope: '#/properties/al',
        },
        {
          type: 'Control',
          scope: '#/properties/unit',
          options: {
            readonly: true,
          },
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          label: 'Occupational Exposure Limit (OEL)',
          scope: '#/properties/oel',
        },
        {
          type: 'Control',
          scope: '#/properties/unit',
          options: {
            readonly: true,
          },
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          label: 'Is less than',
          scope: '#/properties/isLessThan',
          options: {
            readonly: true,
          },
        },
        {
          type: 'Control',
          label: 'Total mass',
          scope: '#/properties/totalMass',
        },
        {
          type: 'Control',
          label: 'Total mass unit',
          scope: '#/properties/totalMassUnit',
        },
      ],
    },
  ],
};
