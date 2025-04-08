import { useEffect, useMemo, useState } from 'react';
import { JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { JsonSchema7 } from '@jsonforms/core';
import {
  useGetAllMetalQuery,
  useGetAllSamplingConditionsQuery,
  useGetAllUnusualConditionsQuery,
  useGetAllVentilationsQuery,
  useGetAllWeldingProcessesQuery,
  useGetAllWorkEnvironmentsQuery,
} from '@tes/static-dropdown-data';
import { ALL_RECORDS_STATUS, useSetSchema } from '@tes/utils-hooks';

interface IProps {
  baseJsonformProps: JsonFormsInitStateProps & JsonFormsReactProps;
  schema: JsonSchema7;
}

export enum DYNAMIC_FORM_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function useSetApiDataInUpdateSchema(props: IProps) {
  const { baseJsonformProps, schema } = props;
  const [schemaState, setSchemaState] = useState<JsonSchema7>(schema);
  const [dynamicFormStatus, setDynamicFormStatus] =
    useState<DYNAMIC_FORM_STATUS>(DYNAMIC_FORM_STATUS.IDLE);

  // Area Sample Subject
  const { allRecordsStatus: metalStatus } = useSetSchema({
    schemaPath: 'properties/metal/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllMetalQuery,
  });
  const { allRecordsStatus: workEnvironmentStatus } = useSetSchema({
    schemaPath: 'properties/workEnvironment/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllWorkEnvironmentsQuery,
  });
  const { allRecordsStatus: ventilationStatus } = useSetSchema({
    schemaPath: 'properties/ventilation/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllVentilationsQuery,
  });
  const { allRecordsStatus: weldingProcessStatus } = useSetSchema({
    schemaPath: 'properties/weldingProcess/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllWeldingProcessesQuery,
  });
  const { allRecordsStatus: samplingConditionsStatus } = useSetSchema({
    schemaPath: 'properties/samplingConditions/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllSamplingConditionsQuery,
  });
  const { allRecordsStatus: unusualConditionsStatus } = useSetSchema({
    schemaPath: 'properties/unusualConditions/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllUnusualConditionsQuery,
  });

  useEffect(() => {
    if (dynamicFormStatus === DYNAMIC_FORM_STATUS.SUCCEEDED) {
      return;
    }
    if (metalStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (unusualConditionsStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (samplingConditionsStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (weldingProcessStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (ventilationStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (workEnvironmentStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }

    setDynamicFormStatus(DYNAMIC_FORM_STATUS.SUCCEEDED);
  }, [
    dynamicFormStatus,
    metalStatus,
    samplingConditionsStatus,
    unusualConditionsStatus,
    ventilationStatus,
    weldingProcessStatus,
    workEnvironmentStatus,
  ]);

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
