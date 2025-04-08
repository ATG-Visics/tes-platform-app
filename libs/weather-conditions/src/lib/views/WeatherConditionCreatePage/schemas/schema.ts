import { JsonSchema7 } from '@jsonforms/core';

export const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    surveyMoment: {
      type: 'object',
    },
    title: {
      type: 'string',
      description:
        'Please describe the moment here, for example, "the start of the day."',
    },
    measuredAt: {
      type: 'string',
    },
    temperatureFahrenheit: {
      type: 'number',
    },
    relativeHumidity: {
      type: 'number',
    },
    windSpeed: {
      type: 'number',
    },
    windDirection: {
      type: 'string',
      oneOf: [
        { const: 'CALM', title: 'Calm' },
        { const: 'N', title: 'From N to S' },
        { const: 'NNE', title: 'From NNE to SSW' },
        { const: 'NE', title: 'From NE to SW' },
        { const: 'ENE', title: 'From ENE to WSW' },
        { const: 'E', title: 'From E to W' },
        { const: 'ESE', title: 'From ESE to WNW' },
        { const: 'SE', title: 'From SE to NW' },
        { const: 'SSE', title: 'From SSE to NNW' },
        { const: 'S', title: 'From S to N' },
        { const: 'SSW', title: 'From SSW to NNE' },
        { const: 'SW', title: 'From SW to NE' },
        { const: 'WSW', title: 'From WSW ENE' },
        { const: 'W', title: 'From W to E' },
        { const: 'WNW', title: 'From WNW ESE' },
        { const: 'NW', title: 'From NW to SE' },
        { const: 'NNW', title: 'From NNW to SSE' },
      ],
    },
    pressure: {
      type: 'string',
    },
    precipitations: {
      type: 'array',
      title: 'Precipitation',
      uniqueItems: true,
      items: {},
    },
    endOfDayPresent: {
      type: 'boolean',
    },
    startOfDayPresent: {
      type: 'boolean',
    },
  },
};
