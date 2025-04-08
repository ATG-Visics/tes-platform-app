import { useEffect, useMemo, useState } from 'react';
import { schema } from '../views';
import { JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { JsonSchema7 } from '@jsonforms/core';
import {
  useGetAllPrecipitationsQuery,
  useGetAllWeatherConditionsQuery,
} from '../api';
import {
  ALL_RECORDS_STATUS,
  mapListResult,
  useSetSchema,
} from '@tes/utils-hooks';

interface IProps {
  baseJsonformProps: JsonFormsInitStateProps & JsonFormsReactProps;
  surveyMoment: {
    project: string;
    startDate: string;
  };
}

export enum DYNAMIC_FORM_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function useSetApiDataInSchema(props: IProps) {
  const { baseJsonformProps, surveyMoment } = props;
  const [schemaState, setSchemaState] = useState<JsonSchema7>(schema);
  const [dynamicFormStatus, setDynamicFormStatus] =
    useState<DYNAMIC_FORM_STATUS>(DYNAMIC_FORM_STATUS.IDLE);

  const { data: weatherConditions } = useGetAllWeatherConditionsQuery({
    surveyMoment,
  });
  const { itemList } = mapListResult(weatherConditions);

  const startOfDayPresent = useMemo(
    () =>
      itemList.map((item) => {
        return item.title.toLowerCase().includes('start');
      }),
    [itemList],
  ).includes(true);

  const endOfDayPresent = useMemo(
    () =>
      itemList.map((item) => {
        return item.title.toLowerCase().includes('end');
      }),
    [itemList],
  ).includes(true);

  const { allRecordsStatus: precipitationStatus } = useSetSchema({
    schemaPath: 'properties/precipitations/items/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllPrecipitationsQuery,
  });

  useEffect(() => {
    if (dynamicFormStatus === DYNAMIC_FORM_STATUS.SUCCEEDED) {
      return;
    }
    if (precipitationStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }

    setDynamicFormStatus(DYNAMIC_FORM_STATUS.SUCCEEDED);
  }, [dynamicFormStatus, precipitationStatus]);

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
    endOfDayPresent,
    startOfDayPresent,
  };
}
