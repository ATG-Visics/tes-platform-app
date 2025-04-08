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
  IInstrumentFormPayload,
  useGetInstrumentByIdQuery,
  useUpdateInstrumentMutation,
  useCreateInstrumentMutation,
  IInstrumentModel,
} from '../../api';
import { schema, uiSchema } from './Schemas';
import { CircularProgress } from '@mui/material';
import { extraRenderers } from '@tes/jsonforms-extensions';
import { useCustomNavigate } from '@tes/router';
import { useFeedback } from '@tes/feedback';

export function InstrumentCreatePage() {
  const { navigateToRoute } = useCustomNavigate();
  const { showFeedback } = useFeedback();
  const [data, setData] = useState<Partial<IInstrumentFormPayload>>({});
  const [open, setOpen] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHasBackButton] =
    useOutletContext<[boolean, Dispatch<SetStateAction<boolean>>]>();

  useEffect(() => setHasBackButton(true), [setHasBackButton]);

  const { recordId, record, recordStatus, isNewRecord } = useRecord({
    useRecordQuery: useGetInstrumentByIdQuery,
  });

  const { jsonformProps, formStatus, hasFormErrors } = useForm<
    IInstrumentFormPayload,
    IInstrumentModel
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
        navigateToRoute('instrumentDetail', { params: { id: successData.id } });
      } else {
        navigateToRoute('instrumentList');
      }
    },
    [navigateToRoute, recordId],
  );

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord,
    data,
    recordId,
    submitSuccessHandler,
    useCreateMutation: useCreateInstrumentMutation,
    useUpdateMutation: useUpdateInstrumentMutation,
  });

  useEffect(() => {
    if (
      submissionStatus === SUBMISSION_STATUS.FAILED &&
      submissionError &&
      open
    ) {
      showFeedback({
        type: 'error',
        message: 'Please try submitting the form again',
        submissionError: submissionError,
        visualizationType: 'modal',
        onClose: () => setOpen(false),
      });
    }
  }, [open, showFeedback, submissionError, submissionStatus]);

  return (
    <>
      {recordStatus === RECORD_STATUS.FAILED && <PageNotFound />}

      {submissionStatus === SUBMISSION_STATUS.SAVING && (
        <TransitionsModal
          description={<CircularProgress />}
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      {formStatus === FORM_STATUS.SUCCEEDED && (
        <FullPageContent
          title={recordId ? `Update ${record?.title}` : 'Add new Instrument'}
          description=""
          formElement={<JsonForms {...jsonformProps} />}
          hasDelete={!isNewRecord}
          deleteTitle="Delete Instrument"
          saveTitle="Save Instrument"
          modalName="Instrument"
          onFormSubmit={onFormSubmit}
          recordId={recordId}
          hasFormErrors={hasFormErrors}
        />
      )}
    </>
  );
}
