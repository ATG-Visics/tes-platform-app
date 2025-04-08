export const uiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'ButtonControl',
          label: 'Start of the day',
          scope: '#/properties/title',
          options: {
            value: 'Start of the day',
          },
          rule: {
            effect: 'DISABLE',
            condition: {
              scope: '#/properties/startOfDayPresent',
              schema: {
                const: true,
              },
            },
          },
        },
        {
          type: 'ButtonControl',
          label: 'During the day',
          scope: '#/properties/title',
          options: {
            value: 'During the day',
          },
        },
        {
          type: 'ButtonControl',
          label: 'End of the day',
          scope: '#/properties/title',
          options: {
            value: 'End of the day',
          },
          rule: {
            effect: 'DISABLE',
            condition: {
              scope: '#/properties/endOfDayPresent',
              schema: {
                const: true,
              },
            },
          },
        },
      ],
    },
    {
      type: 'InputAdornment',
      scope: '#/properties/temperatureFahrenheit',
      options: {
        endAdornment: '<span>&#8457;</span>',
        endAdornmentFormat: 'html',
      },
    },
    {
      type: 'InputAdornment',
      scope: '#/properties/relativeHumidity',
      options: {
        endAdornment: '%RH',
        endAdornmentFormat: 'plaintext',
      },
    },
    {
      type: 'InputAdornment',
      scope: '#/properties/windSpeed',
      options: {
        endAdornment: 'MPH',
      },
    },
    {
      type: 'Control',
      scope: '#/properties/windDirection',
    },
    {
      type: 'InputAdornment',
      scope: '#/properties/pressure',
      options: {
        endAdornment: 'inHg',
      },
    },
    {
      type: 'Control',
      label: 'Precipitation',
      scope: '#/properties/precipitations',
    },
  ],
};
