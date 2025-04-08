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
  ISampleMedia,
  useGetSampleMediaByIdQuery,
  useCreateSampleMediaMutation,
  useUpdateSampleMediaByIdMutation,
} from '../../api';
import { schema, uiSchema } from './Schemas';
import { Alert, AlertTitle, Box, CircularProgress } from '@mui/material';
import { extraRenderers } from '@tes/jsonforms-extensions';
import { useCustomNavigate } from '@tes/router';

export function SampleMediaCreatePage() {
  const { navigateToRoute } = useCustomNavigate();
  const [data, setData] = useState<Partial<ISampleMedia>>({});
  const [open, setOpen] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHasBackButton] =
    useOutletContext<[boolean, Dispatch<SetStateAction<boolean>>]>();

  useEffect(() => setHasBackButton(true), [setHasBackButton]);

  const handleClose = () => setOpen(false);

  const { recordId, record, recordStatus, isNewRecord } = useRecord({
    useRecordQuery: useGetSampleMediaByIdQuery,
  });

  const {
    jsonformProps: baseJsonformProps,
    formStatus,
    hasFormErrors,
  } = useForm({
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
    (_successData) => {
      navigateToRoute(`sampleMediaList`);
    },
    [navigateToRoute],
  );

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord,
    data,
    recordId,
    submitSuccessHandler,
    useCreateMutation: useCreateSampleMediaMutation,
    useUpdateMutation: useUpdateSampleMediaByIdMutation,
  });

  return (
    <>
      {recordStatus === RECORD_STATUS.FAILED && <PageNotFound />}
      {submissionStatus === SUBMISSION_STATUS.FAILED && (
        <TransitionsModal
          title="There is a error with the server"
          description="Try again to submit the form"
          errorList={submissionError?.data as { [key: string]: [string] }}
          showButton
          open={open}
          handleClose={handleClose}
        />
      )}

      {submissionStatus === SUBMISSION_STATUS.SAVING && (
        <TransitionsModal
          description={<CircularProgress />}
          open={open}
          handleClose={handleClose}
        />
      )}

      {submissionStatus === SUBMISSION_STATUS.SUCCEEDED && (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          The sample media is created
        </Alert>
      )}

      {recordStatus === RECORD_STATUS.LOADING && (
        <Box
          sx={{
            position: 'fixed',
            top: 'calc(50% - 48px)',
            left: 'calc(50% - 48px)',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {formStatus === FORM_STATUS.SUCCEEDED && (
        <FullPageContent
          title={recordId ? `Update ${record?.title}` : 'Add new Sample media'}
          description=""
          formElement={<JsonForms {...baseJsonformProps} />}
          hasDelete={!isNewRecord}
          deleteTitle="Delete sample media"
          recordId={recordId}
          saveTitle="Save sample media"
          modalName="Sample Media"
          onFormSubmit={onFormSubmit}
          hasFormErrors={hasFormErrors}
        />
      )}
    </>
  );
}
