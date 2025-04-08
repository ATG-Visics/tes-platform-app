import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { schema } from '../views';
import { JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { JsonSchema7 } from '@jsonforms/core';
import {
  ALL_RECORDS_STATUS,
  FORM_STATUS,
  useSetSchema,
} from '@tes/utils-hooks';
import {
  ISample,
  ISampleListItemPayload,
  useGetAllTwaCalculationsQuery,
} from '../api';

interface IProps {
  baseJsonformProps: JsonFormsInitStateProps & JsonFormsReactProps;
  setData: Dispatch<SetStateAction<Partial<ISampleListItemPayload>>>;
  data?: Partial<ISampleListItemPayload>;
  record?: ISample;
  formStatus: FORM_STATUS;
}

export enum DYNAMIC_FORM_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function useDynamicFormElements(props: IProps) {
  const { baseJsonformProps, setData, record, formStatus } = props;
  const [schemaState, setSchemaState] = useState<JsonSchema7>(schema);

  const { allRecordsStatus: twaCalcultation } = useSetSchema({
    schemaPath: 'properties/twaCalculationMethod/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllTwaCalculationsQuery,
  });

  useEffect(() => {
    if (formStatus !== FORM_STATUS.SUCCEEDED) {
      return;
    }

    setData((prevState) => {
      if (!record) {
        return {
          ...prevState,
        };
      }

      if (!record.initialFlowRate) {
        return {
          ...prevState,
          instrument: record.instrument
            ? {
                id: record.instrument.id,
                title: `${record.instrument.model.title}, #${record.instrument.serialNumber}`,
              }
            : { id: '', title: '' },
          calibratedWith: record.calibratedWith
            ? {
                id: record.calibratedWith.id,
                title: `${record.calibratedWith.model.title}, #${record.calibratedWith.serialNumber}`,
              }
            : { id: '', title: '' },
        };
      }

      return {
        ...prevState,
        instrument: record.instrument
          ? {
              id: record.instrument.id,
              title: `${record.instrument.model.title}, #${record.instrument.serialNumber}`,
            }
          : { id: '', title: '' },
        calibratedWith: record.calibratedWith
          ? {
              id: record.calibratedWith.id,
              title: `${record.calibratedWith.model.title}, #${record.calibratedWith.serialNumber}`,
            }
          : { id: '', title: '' },
        initialFlowRate: record.initialFlowRate,
      };
    });
  }, [formStatus, record, setData]);

  const jsonformProps = useMemo(() => {
    if (twaCalcultation !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }

    return {
      ...baseJsonformProps,
      schema: schemaState,
    };
  }, [baseJsonformProps, schemaState, twaCalcultation]);

  return {
    jsonformProps,
  };
}
