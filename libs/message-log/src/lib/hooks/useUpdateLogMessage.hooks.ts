import { FormEvent, useCallback, useState } from 'react';
import { useUpdateMessageLogMutation } from '../api';
import { ISubmissionError } from '@tes/utils-hooks';

export enum UPDATE_STATUS {
  IDLE = 'idle',
  SAVING = 'saving',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function useUpdateLogMessage() {
  const [data, setData] = useState<string>('');
  const [updateStatus, setUpdateStatus] = useState<UPDATE_STATUS>(
    UPDATE_STATUS.IDLE,
  );
  const [submissionError, setSubmissionError] =
    useState<null | ISubmissionError>(null);
  const [updateState, setUpdateState] = useState<boolean>(false);

  const [updateLogMessage] = useUpdateMessageLogMutation();

  const submitUpdatedMessage = useCallback(
    ({ e, messageId }: { e: FormEvent; messageId: string }) => {
      e.preventDefault();
      if (updateStatus === UPDATE_STATUS.SAVING) {
        // eslint-disable-next-line no-console
        console.warn('Submission already in progress');
        return;
      }

      updateLogMessage({ uuid: messageId, newMessage: data })
        .unwrap()
        .then(
          () => {
            setUpdateStatus(UPDATE_STATUS.SUCCEEDED);
            setUpdateState(false);
          },
          (error) => {
            setUpdateStatus(UPDATE_STATUS.FAILED);
            setSubmissionError(error);
            setUpdateState(false);
          },
        );
    },
    [data, updateLogMessage, updateStatus],
  );

  return {
    updatedLogMessage: data,
    handleUpdate: setData,
    submitUpdatedMessage,
    submitUpdateError: submissionError,
    updateStatus,
    updateState,
    setUpdateState,
  };
}
