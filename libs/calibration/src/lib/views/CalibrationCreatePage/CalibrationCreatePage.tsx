import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useOutletContext } from 'react-router-dom';
import { JsonForms } from '@jsonforms/react';
import { PageNotFound, TransitionsModal } from '@tes/ui/core';
import {
  FORM_STATUS,
  RECORD_STATUS,
  SUBMISSION_STATUS,
  useForm,
  useRecord,
  useSubmitHandler,
} from '@tes/utils-hooks';
import { FullPageContent } from '../../ui';
import {
  ICalibrationFormPayload,
  useGetCalibrationDevicesByIdQuery,
  useUpdateCalibrationDevicesMutation,
  useCreateCalibrationDevicesMutation,
} from '../../api';
import { schema, uiSchema } from './Schemas';
import { CircularProgress } from '@mui/material';
import { extraRenderers } from '@tes/jsonforms-extensions';
import { useCustomNavigate } from '@tes/router';

export function CalibrationCreatePage() {
  const { navigateToRoute } = useCustomNavigate();
  const [data, setData] = useState<Partial<ICalibrationFormPayload>>({});
  const [open, setOpen] = useState<boolean>(true);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHasBackButton] =
    useOutletContext<[boolean, Dispatch<SetStateAction<boolean>>]>();

  useEffect(() => setHasBackButton(true), [setHasBackButton]);

  const { recordId, record, recordStatus, isNewRecord } = useRecord({
    useRecordQuery: useGetCalibrationDevicesByIdQuery,
  });

  const { jsonformProps, formStatus, hasFormErrors } = useForm<
    ICalibrationFormPayload,
    ICalibrationFormPayload
  >({
    schema,
    uischema: uiSchema,
    recordStatus,
    isNewRecord,
    record,
    data,
    setData,
    extraRenderers,
  });

  const submitSuccessHandler = useCallback(
    (successData) => {
      if (recordId === successData.id) {
        // New (or very changed) item
        navigateToRoute('calibrationDetail', {
          params: { id: successData.id },
        });
      } else {
        navigateToRoute('calibrationList');
      }
    },
    [navigateToRoute, recordId],
  );

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord,
    data,
    recordId,
    submitSuccessHandler,
    useCreateMutation: useCreateCalibrationDevicesMutation,
    useUpdateMutation: useUpdateCalibrationDevicesMutation,
  });

  return (
    <>
      {recordStatus === RECORD_STATUS.FAILED && <PageNotFound />}
      {submissionStatus === SUBMISSION_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred on the server"
          description="Please try to submit the form again"
          errorList={submissionError?.data as { [key: string]: [string] }}
          showButton
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      {submissionStatus === SUBMISSION_STATUS.SAVING && (
        <TransitionsModal
          description={<CircularProgress />}
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      {formStatus === FORM_STATUS.SUCCEEDED && (
        <FullPageContent
          title={recordId ? `Update ${record?.title}` : 'Add new calibration'}
          description=""
          formElement={<JsonForms {...jsonformProps} />}
          hasDelete={!isNewRecord}
          deleteTitle="Delete calibration"
          saveTitle="Save calibration"
          modalName="Calibration"
          onFormSubmit={onFormSubmit}
          recordId={recordId}
          hasFormErrors={hasFormErrors}
        />
      )}
    </>
  );
}
