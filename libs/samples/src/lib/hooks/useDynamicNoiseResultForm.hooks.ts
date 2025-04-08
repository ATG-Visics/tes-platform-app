import {
  ALL_RECORDS_STATUS,
  FORM_STATUS,
  useSetSchema,
} from '@tes/utils-hooks';
import { useGetAllNoiseUnitsQuery } from '@tes/units-api';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { JsonSchema7 } from '@jsonforms/core';
import { JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';

interface IProps<RecordType> {
  baseJsonformProps: JsonFormsInitStateProps & JsonFormsReactProps;
  setData: Dispatch<SetStateAction<Partial<RecordType>>>;
  schema: JsonSchema7;
  formStatus?: FORM_STATUS;
}

export function useDynamicNoiseResultFormHooks<RecordType>(
  props: IProps<RecordType>,
) {
  const { baseJsonformProps, schema } = props;
  const [schemaState, setSchemaState] = useState<JsonSchema7>(schema);

  const { allRecordsStatus: unitStatus } = useSetSchema({
    schemaPath: 'properties/unit/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllNoiseUnitsQuery,
  });

  useEffect(() => {
    setSchemaState(schema);
  }, [schema]);

  const jsonformProps = useMemo(() => {
    if (unitStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    return {
      ...baseJsonformProps,
      schema: schemaState,
    };
  }, [unitStatus, baseJsonformProps, schemaState]);

  return {
    jsonformProps,
  };
}
