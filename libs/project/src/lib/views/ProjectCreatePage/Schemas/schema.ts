import { JsonSchema7 } from '@jsonforms/core';

export const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    client: {
      type: 'string',
    },
    jobNumber: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    contactSameAs: {
      type: 'boolean',
    },
    contactPerson: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    phone: {
      type: 'string',
    },
    addressSameAs: {
      type: 'boolean',
    },
    addressLine1: {
      type: 'string',
    },
    addressLine2: {
      type: 'string',
    },
    city: {
      type: 'string',
    },
    postalCode: {
      type: 'string',
    },
    state: {
      type: 'string',
    },
    country: {
      type: 'string',
    },
    staticGroup: {
      type: 'array',
      uniqueItems: true,
      items: {},
    },
    dynamicGroup: {
      type: 'array',
      uniqueItems: true,
      items: {},
    },
    questionGroups: {
      type: 'array',
      uniqueItems: true,
      items: {},
    },
  },
  required: ['title', 'client', 'jobNumber'],
};
