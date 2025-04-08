import { JsonSchema7 } from '@jsonforms/core';

export const schema: JsonSchema7 = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
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
    state: {
      type: 'string',
    },
    postalCode: {
      type: 'string',
    },
    country: {
      type: 'string',
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
    account: {
      type: 'string',
    },
  },
  required: [
    'addressLine1',
    'city',
    'country',
    'postalCode',
    'state',
    'title',
    'contactPerson',
    'email',
  ],
};
