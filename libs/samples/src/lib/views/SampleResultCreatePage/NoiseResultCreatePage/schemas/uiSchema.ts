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
  label: 'Sample results',
  elements: [
    {
      type: 'Group',
      label: 'Exposure limits',
      elements: [
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
            },
          ],
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
      ],
    },
    {
      type: 'Group',
      label: 'Sample results',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              label: 'ACGIH/NIOSH (T80, Q3) dBA',
              scope: '#/properties/acgihNoishDba',
            },
            {
              type: 'Control',
              label: 'ACGIH/NIOSH (T80, Q3) % Dose',
              scope: '#/properties/acgihNoishDose',
            },
          ],
        },
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              label: 'OSHA Hearing Conservation Program (T80, Q5) dBA',
              scope: '#/properties/oshaHcpDba',
            },
            {
              type: 'Control',
              label: 'OSHA Hearing Conservation Program (T80, Q5) % Dose',
              scope: '#/properties/oshaHcpDose',
            },
          ],
        },
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              label: 'OSHA PEL (T90, Q5) dBA',
              scope: '#/properties/oshaPelDba',
            },
            {
              type: 'Control',
              label: 'OSHA PEL (T90, Q5) % Dose',
              scope: '#/properties/oshaPelDose',
            },
          ],
        },
        {
          type: 'Control',
          label: 'LAS max dBA',
          scope: '#/properties/lasMaxDba',
        },
      ],
    },
  ],
};
