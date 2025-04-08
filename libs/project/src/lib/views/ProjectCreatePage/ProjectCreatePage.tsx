import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { JsonForms } from '@jsonforms/react';
import { H1, PageNotFound, TransitionsModal } from '@tes/ui/core';
import {
  FORM_STATUS,
  RECORD_STATUS,
  SUBMISSION_STATUS,
  useForm,
  useRecord,
  useSubmitHandler,
} from '@tes/utils-hooks';
import { useGetAllClientsQuery, useGetClientByIdQuery } from '@tes/client';
import { FullPageContent } from '../../ui';
import {
  ICreateProjectPayload,
  useCreateProjectMutation,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from '../../api';
import { DYNAMIC_FORM_STATUS, useDynamicForm } from '../../hooks';
import { schema, uiSchema } from './Schemas';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import { produce } from 'immer';
import { extraRenderers } from '@tes/jsonforms-extensions';
import { questionExtraRenderers } from '@tes/prompted-questions';
import { useCustomNavigate } from '@tes/router';

export function ProjectCreatePage() {
  const { navigateToRoute } = useCustomNavigate();
  const [data, setData] = useState<Partial<ICreateProjectPayload>>({});
  const [isOpen, setIsOpen] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHasBackButton] =
    useOutletContext<[boolean, Dispatch<SetStateAction<boolean>>]>();

  const {
    data: clientData,
    isLoading,
    isError,
  } = useGetAllClientsQuery({ limit: 10000 });

  const { clientId } = useParams();

  useEffect(() => setHasBackButton(true), [setHasBackButton]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const { recordId, record, recordStatus, isNewRecord } = useRecord({
    useRecordQuery: useGetProjectByIdQuery,
  });

  const { record: clientRecord } = useRecord({
    useRecordQuery: useGetClientByIdQuery,
    givenId: record?.client.id || data.client,
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
    extraRenderers: [...extraRenderers, ...questionExtraRenderers],
  });

  const hasErrors = useMemo(() => {
    if (hasFormErrors) return true;
    return !data;
  }, [data, hasFormErrors]);

  const { jsonformProps, dynamicFormStatus } = useDynamicForm({
    baseJsonformProps,
    clientData,
    isLoading,
    isError,
  });

  const submitSuccessHandler = useCallback(
    (successData) => {
      navigateToRoute('projectOverview', { params: { id: successData.id } });
    },
    [navigateToRoute],
  );

  const { submissionStatus, submissionError, submitHandler } = useSubmitHandler(
    {
      isNewRecord,
      data,
      recordId,
      submitSuccessHandler,
      useCreateMutation: useCreateProjectMutation,
      useUpdateMutation: useUpdateProjectMutation,
    },
  );

  useEffect(() => {
    if (!data.questionGroups) {
      return;
    }

    setData(
      produce((draft) => {
        draft.staticGroup = data.questionGroups;
        draft.dynamicGroup = data.questionGroups;
      }),
    );
  }, [data.questionGroups]);

  useEffect(() => {
    if (!clientId) {
      return;
    }

    setData(
      produce((draft) => {
        draft.client = clientId;
      }),
    );
  }, [clientId]);

  useEffect(() => {
    if (!record?.client) {
      return;
    }

    if (typeof data.client === 'object') {
      setData(
        produce((draft) => {
          draft.client = record.client.id;
        }),
      );
    }
  }, [data.client, record?.client]);

  useEffect(() => {
    if (!clientRecord) {
      return;
    }

    if (!data.addressSameAs && !record?.addressLine1) {
      setData((prevState) => ({
        ...prevState,
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      }));
      return;
    }

    setData((prevState) => ({
      ...prevState,
      addressLine1: clientRecord.addressLine1,
      addressLine2: clientRecord.addressLine2,
      city: clientRecord.city,
      state: clientRecord.state,
      postalCode: clientRecord.postalCode,
      country: clientRecord.country,
    }));
  }, [data.addressSameAs, clientRecord, record?.addressLine1]);

  useEffect(() => {
    if (!clientRecord) {
      return;
    }

    if (!data.contactSameAs && !record?.email) {
      setData((prevState) => ({
        ...prevState,
        contactPerson: '',
        email: '',
        phone: '',
      }));
      return;
    }

    setData((prevState) => ({
      ...prevState,
      contactPerson: clientRecord.contactPerson,
      email: clientRecord.email,
      phone: clientRecord.phone,
    }));
  }, [data.contactSameAs, clientRecord, record?.email]);

  const onFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const staticGroup = data.staticGroup || [];
      const dynamicGroup = data.dynamicGroup || [];

      const questionGroupSet = new Set([...staticGroup, ...dynamicGroup]);
      const newData = {
        ...data,
        questionGroups: [...questionGroupSet.values()],
      } as ICreateProjectPayload;

      submitHandler(newData);
    },
    [data, submitHandler],
  );

  return (
    <>
      {recordStatus === RECORD_STATUS.FAILED && <PageNotFound />}
      {submissionStatus === SUBMISSION_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred on the server"
          description="Please try to submit the form again"
          showButton
          errorList={submissionError?.data as { [key: string]: [string] }}
          open={isOpen}
          handleClose={handleClose}
        />
      )}

      {submissionStatus === SUBMISSION_STATUS.SAVING && (
        <TransitionsModal
          description={<CircularProgress />}
          open={isOpen}
          handleClose={handleClose}
        />
      )}

      {submissionStatus === SUBMISSION_STATUS.SUCCEEDED && (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          Your project is created.
        </Alert>
      )}

      {dynamicFormStatus === DYNAMIC_FORM_STATUS.LOADING && (
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

      {formStatus === FORM_STATUS.SUCCEEDED &&
        dynamicFormStatus === DYNAMIC_FORM_STATUS.SUCCEEDED && (
          <FullPageContent
            title={recordId ? `Update ${record?.title}` : 'Add new Project'}
            description=""
            formElement={
              jsonformProps ? (
                <JsonForms {...jsonformProps} />
              ) : (
                <JsonForms {...baseJsonformProps} />
              )
            }
            hasDelete={!isNewRecord}
            deleteTitle="Delete project"
            saveTitle={`Save ${isNewRecord ? 'new' : ''} project`}
            modalName="Project"
            onFormSubmit={(event) => {
              onFormSubmit(event);
              setIsOpen(true);
            }}
            recordId={recordId}
            hasFormErrors={hasErrors}
          />
        )}

      {dynamicFormStatus === DYNAMIC_FORM_STATUS.FAILED &&
        clientData &&
        clientData?.count < 1 && (
          <Paper
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              alignSelf: 'center',
              alignItems: 'center',
              width: 'fit-content',
            }}
          >
            <H1 variant="h5">
              You must create a client before creating a project!
            </H1>
            <Button
              sx={{ width: 'fit-content' }}
              variant="contained"
              onClick={() => navigateToRoute(`clientCreate`)}
            >
              Create client
            </Button>
          </Paper>
        )}
    </>
  );
}
