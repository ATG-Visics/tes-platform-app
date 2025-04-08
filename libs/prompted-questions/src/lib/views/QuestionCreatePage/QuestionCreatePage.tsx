import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useOutletContext } from 'react-router-dom';
import { JsonForms } from '@jsonforms/react';
import { TransitionsModal } from '@tes/ui/core';
import {
  FORM_STATUS,
  SUBMISSION_STATUS,
  useForm,
  useRecord,
} from '@tes/utils-hooks';
import { FullPageContent } from '../../ui';
import { schema, uiSchema } from './Schemas';
import { CircularProgress } from '@mui/material';
import { extraRenderers } from '@tes/jsonforms-extensions';
import {
  IGroup,
  useGetQuestionGroupByIdQuery,
  useUpdateGroupByIdMutation,
  useUpdateOrCreateGroupItemsMutation,
} from '../../api/';
import { questionExtraRenderers } from '../../control';
import { useBulkSubmitHandler } from '../../hooks';
import { useCustomNavigate } from '@tes/router';

export function QuestionCreatePage() {
  const { navigateToRoute } = useCustomNavigate();

  const [data, setData] = useState<Partial<{ group: Array<IGroup> }>>({});
  const [open, setOpen] = useState<boolean>(true);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHasBackButton] =
    useOutletContext<[boolean, Dispatch<SetStateAction<boolean>>]>();

  useEffect(() => setHasBackButton(true), [setHasBackButton]);

  const handleClose = useCallback(() => setOpen(false), []);

  const { recordId, record, recordStatus, isNewRecord } = useRecord({
    useRecordQuery: useGetQuestionGroupByIdQuery,
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
    record: null,
    data,
    setData,
    extraRenderers: [...extraRenderers, ...questionExtraRenderers],
  });

  useEffect(() => {
    if (!record) {
      return;
    }

    setData({
      group: [
        {
          ...record,
          repeatEverySurveyMoment: `${record.repeatEverySurveyMoment}`,
        },
      ],
    });
  }, [record]);

  const submitSuccessHandler = useCallback(
    (_successData) => {
      navigateToRoute('promptedQuestions');
    },
    [navigateToRoute],
  );

  const { submissionStatus, onFormSubmit, submissionError } =
    useBulkSubmitHandler({
      data,
      recordId,
      submitSuccessHandler,
      useUpdateOrCreateMutation: useUpdateOrCreateGroupItemsMutation,
      useUpdateMutation: useUpdateGroupByIdMutation,
    });

  return (
    <>
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

      {formStatus === FORM_STATUS.SUCCEEDED && (
        <FullPageContent
          title={recordId ? `Update ${record?.title}` : 'Create questions'}
          description="You can drag & drop questions types to the group you want, from the sidebar on the right."
          formElement={<JsonForms {...baseJsonformProps} />}
          hasDelete={false}
          deleteTitle="Delete questions"
          recordId={recordId}
          saveTitle={recordId ? 'Update group' : 'Save group'}
          modalName="Question"
          onFormSubmit={(event) => {
            onFormSubmit(event);
            setOpen(true);
          }}
          hasFormErrors={hasFormErrors}
          hasData={!!data.group?.length}
        />
      )}
    </>
  );
}
