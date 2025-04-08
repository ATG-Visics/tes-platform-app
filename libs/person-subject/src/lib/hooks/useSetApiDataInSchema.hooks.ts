import { useEffect, useMemo, useState } from 'react';
import { schema } from '../views';
import { JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { JsonSchema7 } from '@jsonforms/core';
import {
  useGetAllBootsQuery,
  useGetAllClothingQuery,
  useGetAllExposureControlsQuery,
  useGetAllEyeWearQuery,
  useGetAllGlovesQuery,
  useGetAllHeadProtectionQuery,
  useGetAllHearingProtectionQuery,
  useGetAllRespiratorQuery,
  useGetAllSamplingConditionsQuery,
  useGetAllUnusualConditionsQuery,
  useGetAllVentilationsQuery,
  useGetAllWeldingProcessesQuery,
  useGetAllWorkEnvironmentsQuery,
} from '@tes/static-dropdown-data';
import { ALL_RECORDS_STATUS, useSetSchema } from '@tes/utils-hooks';
import { DYNAMIC_FORM_STATUS } from './useSetApiDataInUpdateSchema.hooks';

interface IProps {
  baseJsonformProps: JsonFormsInitStateProps & JsonFormsReactProps;
}

export function useSetApiDataInSchema(props: IProps) {
  const { baseJsonformProps } = props;
  const [schemaState, setSchemaState] = useState<JsonSchema7>(schema);
  const [dynamicFormStatus, setDynamicFormStatus] =
    useState<DYNAMIC_FORM_STATUS>(DYNAMIC_FORM_STATUS.IDLE);

  // Person Sample Subject

  const { allRecordsStatus: personWorkEnvironmentStatus } = useSetSchema({
    schemaPath: 'properties/workEnvironment/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllWorkEnvironmentsQuery,
  });

  const { allRecordsStatus: personVentilationStatus } = useSetSchema({
    schemaPath: 'properties/ventilation/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllVentilationsQuery,
  });

  const { allRecordsStatus: personWeldingProcessStatus } = useSetSchema({
    schemaPath: 'properties/weldingProcess/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllWeldingProcessesQuery,
  });

  const { allRecordsStatus: personSamplingConditionsStatus } = useSetSchema({
    schemaPath: 'properties/samplingConditions/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllSamplingConditionsQuery,
  });

  const { allRecordsStatus: personUnusualConditionsStatus } = useSetSchema({
    schemaPath: 'properties/unusualConditions/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllUnusualConditionsQuery,
  });

  const { allRecordsStatus: personExposureControlStatus } = useSetSchema({
    schemaPath: 'properties/exposureControls/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllExposureControlsQuery,
  });

  const { allRecordsStatus: personClothingStatus } = useSetSchema({
    schemaPath: 'properties/clothing/items/enum',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllClothingQuery,
  });
  const { allRecordsStatus: personGlovesStatus } = useSetSchema({
    schemaPath: 'properties/gloves/items/enum',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllGlovesQuery,
  });
  const { allRecordsStatus: personBootsStatus } = useSetSchema({
    schemaPath: 'properties/boots/items/enum',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllBootsQuery,
  });
  const { allRecordsStatus: personEyeWearStatus } = useSetSchema({
    schemaPath: 'properties/eyeWear/items/enum',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllEyeWearQuery,
  });
  const { allRecordsStatus: personHeadProtectionStatus } = useSetSchema({
    schemaPath: 'properties/headProtection/items/enum',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllHeadProtectionQuery,
  });
  const { allRecordsStatus: personHearingProtectionStatus } = useSetSchema({
    schemaPath: 'properties/hearingProtection/items/enum',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllHearingProtectionQuery,
  });
  const { allRecordsStatus: personRespiratorStatus } = useSetSchema({
    schemaPath: 'properties/respirator/items/enum',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllRespiratorQuery,
  });

  useEffect(() => {
    if (dynamicFormStatus === DYNAMIC_FORM_STATUS.SUCCEEDED) {
      return;
    }
    if (personUnusualConditionsStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (personSamplingConditionsStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (personWeldingProcessStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (personVentilationStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (personWorkEnvironmentStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (personExposureControlStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (personClothingStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (personGlovesStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (personBootsStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (personEyeWearStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (personHeadProtectionStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (personHearingProtectionStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }
    if (personRespiratorStatus !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }

    setDynamicFormStatus(DYNAMIC_FORM_STATUS.SUCCEEDED);
  }, [
    dynamicFormStatus,
    personClothingStatus,
    personExposureControlStatus,
    personEyeWearStatus,
    personGlovesStatus,
    personBootsStatus,
    personHeadProtectionStatus,
    personHearingProtectionStatus,
    personRespiratorStatus,
    personSamplingConditionsStatus,
    personUnusualConditionsStatus,
    personVentilationStatus,
    personWeldingProcessStatus,
    personWorkEnvironmentStatus,
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
