import { useMemo, useState } from 'react';
import { JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { JsonSchema7 } from '@jsonforms/core';
import { ALL_RECORDS_STATUS, useSetSchema } from '@tes/utils-hooks';
import { useGetAllUnitsQuery } from '@tes/units-api';
import {
  useGetAllActionLevelsQuery,
  useGetAllOelSourcesQuery,
} from '@tes/action-level-api';
import { schema } from '../ui/SamplingPlanCreateForm';

interface IProps {
  baseJsonformProps: JsonFormsInitStateProps & JsonFormsReactProps;
}

export enum DYNAMIC_FORM_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function useDynamicFormElements(props: IProps) {
  const { baseJsonformProps } = props;
  const [schemaState, setSchemaState] = useState<JsonSchema7>(schema);

  const { allRecordsStatus: unitStatus } = useSetSchema({
    schemaPath: 'properties/hazardScenarios/items/properties/unit/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllUnitsQuery,
  });

  const { allRecordsStatus: actionLevelStatus } = useSetSchema({
    schemaPath:
      'properties/hazardScenarios/items/properties/actionLevelSource/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllActionLevelsQuery,
  });

  const { allRecordsStatus: oelStatus } = useSetSchema({
    schemaPath: 'properties/hazardScenarios/items/properties/oelSource/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllOelSourcesQuery,
  });

  const jsonformProps = useMemo(() => {
    if (unitStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (actionLevelStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (oelStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }

    return {
      ...baseJsonformProps,
      schema: schemaState,
    };
  }, [
    oelStatus,
    actionLevelStatus,
    baseJsonformProps,
    schemaState,
    unitStatus,
  ]);

  return {
    jsonformProps,
  };
}
