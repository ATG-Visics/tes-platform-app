import { CircularProgress } from '@mui/material';
import {
  FORM_STATUS,
  SUBMISSION_STATUS,
  useForm,
  useRecord,
  useSubmitHandler,
} from '@tes/utils-hooks';
import {
  IProjectLocation,
  IProjectLocationCreatePayload,
  useCreateProjectLocationMutation,
  useUpdateProjectLocationMutation,
  useGetProjectLocationByIdQuery,
} from '../../api';
import { FullPageContent } from '../../ui';
import { schema, uiSchema } from './Schemas';
import { useCallback, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { TransitionsModal } from '@tes/ui/core';
import { extraRenderers } from '@tes/jsonforms-extensions';
import { useCustomNavigate } from '@tes/router';

export function ProjectLocationUpdatePage() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { navigateToRoute } = useCustomNavigate();
  const [data, setData] = useState<Partial<IProjectLocationCreatePayload>>({});

  const { recordId, record, recordStatus, isNewRecord } = useRecord({
    useRecordQuery: useGetProjectLocationByIdQuery,
  });

  const handleErrorClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const { jsonformProps: baseJsonformProps, formStatus } = useForm<
    IProjectLocationCreatePayload,
    IProjectLocation
  >({
    schema,
    uischema: uiSchema,
    recordStatus,
    isNewRecord,
    data,
    setData,
    record,
    extraRenderers,
  });

  const submitSuccessHandler = useCallback(
    (successData) => {
      if (!successData) {
        return;
      }
      navigateToRoute(-1);
    },
    [navigateToRoute],
  );

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord,
    data,
    recordId,
    submitSuccessHandler,
    useCreateMutation: useCreateProjectLocationMutation,
    useUpdateMutation: useUpdateProjectLocationMutation,
  });

  return (
    <>
      {submissionStatus === SUBMISSION_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred on the server"
          description="Please try to submit the form again"
          errorList={submissionError?.data as { [key: string]: [string] }}
          showButton
          open={isOpen}
          handleClose={handleErrorClose}
        />
      )}

      {submissionStatus === SUBMISSION_STATUS.SAVING && (
        <TransitionsModal
          description={<CircularProgress />}
          open={isOpen}
          handleClose={handleErrorClose}
        />
      )}

      {formStatus === FORM_STATUS.SUCCEEDED && (
        <FullPageContent
          title={
            recordId ? `Update ${record?.title}` : 'Add new Project location'
          }
          description=""
          formElement={<JsonForms {...baseJsonformProps} />}
          hasDelete={!isNewRecord}
          deleteTitle="Delete project location"
          saveTitle={
            recordId ? `Update ${record?.title}` : 'Add new Project location'
          }
          modalName="Project location"
          onFormSubmit={onFormSubmit}
          recordId={recordId}
        />
      )}
    </>
  );
}
