export const uiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      elements: [
        {
          type: 'Control',
          label: 'Instrument name',
          scope: '#/properties/title',
        },
        {
          type: 'Control',
          label: 'Instrument used to sample for',
          scope: '#/properties/instrumentType',
        },
      ],
    },
    {
      type: 'Group',
      elements: [
        {
          type: 'Control',
          label: 'Serial numbers',
          scope: '#/properties/instrumentSet',
        },
      ],
    },
  ],
};
