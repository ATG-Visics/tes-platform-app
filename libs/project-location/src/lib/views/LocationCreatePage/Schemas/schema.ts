import { JsonSchema7 } from '@jsonforms/core';

export const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    title: {
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
  },
  required: ['title'],
};
