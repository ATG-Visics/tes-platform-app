import { JsonFormsI18nState } from '@jsonforms/core';
import localizeNl from 'ajv-i18n/localize/nl';
import { ErrorObject } from 'ajv';

export const i18n: JsonFormsI18nState = {
  locale: 'nl',
  translateError: (error: ErrorObject): string => {
    let errorMessage: string;

    if (error.keyword === 'required') {
      errorMessage = 'Dit veld is verplicht';
    } else {
      localizeNl([error]);
      errorMessage = error.message || 'Onbekende fout';
    }

    if (
      error.keyword === 'pattern' &&
      (error.schema as string).includes('https?')
    ) {
      errorMessage = 'Website is ongeldig. Zie voorbeelden hierboven.';
    }

    return errorMessage;
  },
};
