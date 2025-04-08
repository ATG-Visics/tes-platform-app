export const uiSchema = {
  type: 'Categorization',
  elements: [
    {
      type: 'Category',
      label: 'Subject data',
      elements: [
        {
          type: 'Group',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/title',
            },
          ],
        },
        {
          type: 'Group',
          elements: [
            {
              type: 'Control',
              label: 'What type of subject you want to add?',
              scope: '#/properties/subjectType',
              options: {
                format: 'radio',
              },
            },
            {
              type: 'SEGApiControl',
              label: 'SEG',
              scope: '#/properties/seg',
              rule: {
                effect: 'HIDE',
                condition: true,
              },
            },
            {
              type: 'Control',
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
            {
              type: 'Control',
              scope: '#/properties/taskDescription',
            },
          ],
        },
      ],
    },
    {
      type: 'Category',
      label: 'Sample data',
      elements: [
        {
          type: 'Group',
          elements: [
            {
              type: 'Control',
              label: 'Sample type',
              scope: '#/properties/sampleType',
              options: {
                format: 'radio',
              },
            },

            {
              type: 'ScenarioHazardsControl',
              label: 'Hazards of concern',
              scope: '#/properties/hazardScenarios',
              options: {
                detail: {
                  type: 'VerticalLayout',
                  elements: [
                    {
                      type: 'HorizontalLayout',
                      elements: [
                        {
                          type: 'SingleHazardControl',
                          label: 'Hazard',
                          scope: '#/properties/hazard',
                        },
                        {
                          type: 'Control',
                          label: 'Unit',
                          scope: '#/properties/unit',
                        },
                      ],
                    },
                    {
                      type: 'HorizontalLayout',
                      elements: [
                        {
                          type: 'Control',
                          label: 'Analytical method',
                          scope: '#/properties/analyticalMethod',
                        },
                        {
                          type: 'Control',
                          label: '# of Samples',
                          scope: '#/properties/targetSampleCount',
                        },
                      ],
                    },
                    {
                      type: 'HorizontalLayout',
                      elements: [
                        {
                          type: 'Control',
                          label: 'Action level',
                          scope: '#/properties/actionLevel',
                        },
                        {
                          type: 'Control',
                          label: 'Unit',
                          scope: '#/properties/unit',
                        },
                        {
                          type: 'Control',
                          label: 'Action level source',
                          scope: '#/properties/actionLevelSource',
                        },
                      ],
                    },
                    {
                      type: 'HorizontalLayout',
                      elements: [
                        {
                          type: 'Control',
                          label: 'OEL',
                          scope: '#/properties/oel',
                        },
                        {
                          type: 'Control',
                          label: 'Unit',
                          scope: '#/properties/unit',
                        },
                        {
                          type: 'Control',
                          label: 'OEL source',
                          scope: '#/properties/oelSource',
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
        {
          type: 'Group',
          label: 'Equipment',
          elements: [
            {
              type: 'SampleMediaControl',
              label: 'Sample media',
              scope: '#/properties/media',
            },
          ],
        },
      ],
    },
  ],
  options: {
    variant: 'stepper',
    showNavButtons: true,
  },
};
