export const uiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      elements: [
        {
          type: 'Control',
          label: 'Calibration name',
          scope: '#/properties/title',
        },
      ],
    },
    {
      type: 'Group',
      elements: [
        {
          type: 'Control',
          label: 'Serial numbers',
          scope: '#/properties/calibrationInstrumentSet',
        },
      ],
    },
  ],
};
