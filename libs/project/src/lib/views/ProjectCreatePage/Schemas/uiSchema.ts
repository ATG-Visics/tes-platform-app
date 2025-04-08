export const uiSchema = {
  type: 'Categorization',
  elements: [
    {
      type: 'Category',
      label: 'Project information',
      elements: [
        {
          type: 'Group',
          elements: [
            {
              type: 'Control',
              label: 'Project name',
              scope: '#/properties/title',
            },
            {
              type: 'Control',
              label: 'Client',
              scope: '#/properties/client',
            },
            {
              type: 'Control',
              label: 'Job number',
              scope: '#/properties/jobNumber',
            },
            {
              type: 'Control',
              label: 'Project description (if applicable)',
              scope: '#/properties/description',
              options: {
                multi: true,
              },
            },
          ],
        },
      ],
    },
    {
      type: 'Category',
      label: 'Contact information',
      elements: [
        {
          type: 'Group',
          elements: [
            {
              type: 'Control',
              label: 'Is the contact information the same as the client?',
              scope: '#/properties/contactSameAs',
            },
            {
              type: 'Control',
              label: 'Contact person',
              scope: '#/properties/contactPerson',
            },
            {
              type: 'Control',
              label: 'Phone',
              scope: '#/properties/phone',
            },
            {
              type: 'Control',
              label: 'Email',
              scope: '#/properties/email',
            },
          ],
        },
        {
          type: 'Group',
          elements: [
            {
              type: 'Control',
              label: 'Is the address information the same as the client?',
              scope: '#/properties/addressSameAs',
            },
            {
              type: 'Control',
              label: 'Address line 1',
              scope: '#/properties/addressLine1',
            },
            {
              type: 'Control',
              label: 'Address line 2',
              scope: '#/properties/addressLine2',
            },
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'Control',
                  label: 'City',
                  scope: '#/properties/city',
                },
                {
                  type: 'Control',
                  label: 'State',
                  scope: '#/properties/state',
                },
              ],
            },
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'Control',
                  label: 'Postal code',
                  scope: '#/properties/postalCode',
                },
                {
                  type: 'Control',
                  label: 'Country',
                  scope: '#/properties/country',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'Category',
      label: 'Question information',
      elements: [
        {
          type: 'Group',
          elements: [
            {
              type: 'GroupSelectorControl',
              label: 'Select a global question group',
              scope: '#/properties/staticGroup',
              options: {
                static: true,
              },
            },
          ],
        },
        {
          type: 'Group',
          elements: [
            {
              type: 'GroupSelectorControl',
              label: 'Select a daily question group',
              scope: '#/properties/dynamicGroup',
              options: {
                static: false,
              },
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
