import { useEffect, useMemo, useState } from 'react';
import { JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { JsonSchema7 } from '@jsonforms/core';
import { schema } from '../views/ProjectCreatePage/Schemas';
import {
  DjangoRestFrameworkResult,
  mapListResult,
  updateOneOfValidator,
} from '@tes/utils-hooks';
import { IClient } from '@tes/client';

interface IProps {
  baseJsonformProps: JsonFormsInitStateProps & JsonFormsReactProps;
  clientData: DjangoRestFrameworkResult<IClient> | undefined;
  isLoading: boolean;
  isError: boolean;
}

export enum DYNAMIC_FORM_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function useDynamicForm(props: IProps) {
  const { baseJsonformProps, clientData, isLoading, isError } = props;
  const [schemaState, setSchemaState] = useState<JsonSchema7>(schema);
  const [dynamicFormStatus, setDynamicFormStatus] =
    useState<DYNAMIC_FORM_STATUS>(DYNAMIC_FORM_STATUS.IDLE);

  useEffect(() => {
    if (dynamicFormStatus === DYNAMIC_FORM_STATUS.LOADING) {
      return;
    }

    if (isLoading) {
      setDynamicFormStatus(DYNAMIC_FORM_STATUS.LOADING);
    }
  }, [dynamicFormStatus, isLoading]);

  useEffect(() => {
    if (dynamicFormStatus === DYNAMIC_FORM_STATUS.FAILED) {
      return;
    }

    if (isError) {
      setDynamicFormStatus(DYNAMIC_FORM_STATUS.FAILED);
    }
  }, [dynamicFormStatus, isError]);

  useEffect(() => {
    if (!clientData) {
      setDynamicFormStatus(DYNAMIC_FORM_STATUS.FAILED);

      return;
    }

    if (clientData && clientData?.count < 1) {
      setDynamicFormStatus(DYNAMIC_FORM_STATUS.FAILED);

      return;
    }

    if (dynamicFormStatus === DYNAMIC_FORM_STATUS.SUCCEEDED) {
      return;
    }

    const { itemList: clientList } = mapListResult(clientData);

    const newFieldOfApplicationList = clientList.map((item) => ({
      const: item.id,
      title: item.title,
    }));

    updateOneOfValidator(newFieldOfApplicationList, setSchemaState, [
      'properties',
      'client',
      'oneOf',
    ]);

    setDynamicFormStatus(DYNAMIC_FORM_STATUS.SUCCEEDED);
  }, [clientData, dynamicFormStatus, setSchemaState]);

  const jsonformProps = useMemo(() => {
    if (dynamicFormStatus !== DYNAMIC_FORM_STATUS.SUCCEEDED) {
      return;
    }

    return {
      ...baseJsonformProps,
      schema: schemaState,
    };
  }, [baseJsonformProps, dynamicFormStatus, schemaState]);

  return {
    jsonformProps,
    dynamicFormStatus,
  };
}
