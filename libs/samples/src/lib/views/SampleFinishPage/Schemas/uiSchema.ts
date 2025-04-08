export const uiSchema = {
  type: 'Group',
  label: 'Finish information',
  elements: [
    {
      type: 'Control',
      label: 'Final calibration" (dBA)',
      scope: '#/properties/finalFlowRate',
      rule: {
        effect: 'SHOW',
        condition: {
          scope: '#/properties/isChemical',
          schema: {
            const: false,
          },
        },
      },
    },
    {
      type: 'InputAdornment',
      label: 'Final Flowrate',
      scope: '#/properties/finalFlowRate',
      rule: {
        effect: 'SHOW',
        condition: {
          scope: '#/properties/isChemical',
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
  ],
};
