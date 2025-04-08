import { JsonSchema7 } from '@jsonforms/core';

export const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    group: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          title: {
            type: 'string',
            title: 'Group title',
          },
          isRequiredForNewProjects: {
            type: 'boolean',
            title: 'Is required for new projects',
          },
          repeatEverySurveyMoment: {
            type: 'string',
            oneOf: [
              {
                const: 'true',
                title: 'Every survey moment, per project assigned',
              },
              {
                const: 'false',
                title: 'One time, per project assigned',
              },
            ],
            title: 'Question Frequency',
          },
          questions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: {
                  type: 'string',
                },
                kind: {
                  type: 'string',
                },
                choices: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      label: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        required: ['repeatEverySurveyMoment'],
      },
    },
  },
};
