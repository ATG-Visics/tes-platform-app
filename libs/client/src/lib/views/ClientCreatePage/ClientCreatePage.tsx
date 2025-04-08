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
  IClient,
  useCreateClientMutation,
  useGetClientByIdQuery,
  useUpdateClientMutation,
} from '../../api';
import { schema, uiSchema } from './Schemas';
import { Alert, AlertTitle, Box, CircularProgress } from '@mui/material';
import { extraRenderers } from '@tes/jsonforms-extensions';
import { useSelector } from 'react-redux';
import { getAccountId } from '@tes/accounts';
import { useCustomNavigate } from '@tes/router';

export function ClientCreatePage() {
  const { navigateToRoute } = useCustomNavigate();
  const accountId = useSelector(getAccountId);

  const [data, setData] = useState<Partial<IClient>>({});
  const [open, setOpen] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHasBackButton] =
    useOutletContext<[boolean, Dispatch<SetStateAction<boolean>>]>();

  useEffect(() => setHasBackButton(true), [setHasBackButton]);

  const handleClose = () => setOpen(false);

  const { recordId, record, recordStatus, isNewRecord } = useRecord({
    useRecordQuery: useGetClientByIdQuery,
  });

  const {
    jsonformProps: baseJsonformProps,
    formStatus,
    hasFormErrors,
  } = useForm<IClient, IClient>({
    schema,
    uischema: uiSchema,
    recordStatus,
    isNewRecord,
    record,
    data,
    setData,
    extraRenderers,
  });

  useEffect(() => {
    if (record) {
      return;
    }

    if (!accountId) {
      return;
    }

    setData((prevState) => ({ ...prevState, account: accountId }));
  }, [accountId, record]);

  const submitSuccessHandler = useCallback(
    (successData) => {
      if (recordId === successData.id) {
        // New (or very changed) item
        navigateToRoute(`clientDetail`, { params: { id: successData.id } });
      } else {
        navigateToRoute('clientList');
      }
    },
    [navigateToRoute, recordId],
  );

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord,
    data,
    recordId,
    submitSuccessHandler,
    useCreateMutation: useCreateClientMutation,
    useUpdateMutation: useUpdateClientMutation,
  });

  return (
    <>
      {recordStatus === RECORD_STATUS.FAILED && <PageNotFound />}
      {submissionStatus === SUBMISSION_STATUS.FAILED && (
        <TransitionsModal
          title="There is a error with the server"
          description="Try again to submit the form"
          showButton
          errorList={submissionError?.data as { [key: string]: [string] }}
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
          The client is created
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
          title={recordId ? `Update ${record?.title}` : 'Add new Client'}
          description=""
          formElement={<JsonForms {...baseJsonformProps} />}
          hasDelete={!isNewRecord}
          deleteTitle="Delete client"
          recordId={recordId}
          saveTitle="Save client"
          modalName="Client"
          onFormSubmit={(event) => {
            onFormSubmit(event);
            setOpen(true);
          }}
          hasFormErrors={hasFormErrors}
        />
      )}
    </>
  );
}
