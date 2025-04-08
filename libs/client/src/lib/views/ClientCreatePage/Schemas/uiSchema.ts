export const uiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      elements: [
        {
          type: 'Control',
          label: 'Company name',
          scope: '#/properties/title',
        },
      ],
    },
    {
      type: 'Group',
      elements: [
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
              label: 'State/Province',
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
    {
      type: 'Group',
      elements: [
        {
          type: 'Control',
          label: 'Contact person',
          scope: '#/properties/contactPerson',
        },
        {
          type: 'Control',
          label: 'Email address',
          scope: '#/properties/email',
        },
        {
          type: 'Control',
          label: 'Phone number',
          scope: '#/properties/phone',
        },
      ],
    },
  ],
};
