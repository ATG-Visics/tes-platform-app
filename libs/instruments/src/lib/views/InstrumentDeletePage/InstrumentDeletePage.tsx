import { DialogProps } from '@mui/material';
import { useDeleteInstrumentMutation } from '../../api';
import { useCallback, useEffect, useState } from 'react';
import { ConfirmDeleteDialog } from '../../ui';
import { ISubmissionError } from '@tes/utils-hooks';
import { useCustomNavigate } from '@tes/router';
import { useFeedback } from '@tes/feedback';

export enum DELETE_STATUS {
  IDLE = 'idle',
  LOADING = 'saving',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function InstrumentDeletePage(
  props: Pick<DialogProps, 'open' | 'onClose'> & {
    onConfirm?: () => void;
    onCancel: () => void;
    modalName: string | null;
    recordId?: string;
  },
) {
  const { navigateToRoute } = useCustomNavigate();
  const { showFeedback } = useFeedback();
  const { open, onClose, onCancel, recordId, modalName } = props;
  const [deleteStatus, setDeleteStatus] = useState<DELETE_STATUS>(
    DELETE_STATUS.IDLE,
  );
  const [deleteInstrument, { isError, isSuccess }] =
    useDeleteInstrumentMutation();

  const [modalOpen, setOpen] = useState<boolean>(true);
  const handleClose = () => setOpen(false);

  const [deletionError, setDeletionError] = useState<null | ISubmissionError>(
    null,
  );

  const handleDelete = useCallback(() => {
    if (!recordId) {
      return;
    }
    setOpen(true);
    setDeleteStatus(DELETE_STATUS.LOADING);

    deleteInstrument(recordId)
      .unwrap()
      .then(
        () => {
          setDeleteStatus(DELETE_STATUS.SUCCEEDED);
        },
        (error) => {
          setDeleteStatus(DELETE_STATUS.FAILED);
          setDeletionError(error);
        },
      );
  }, [deleteInstrument, recordId]);

  useEffect(() => {
    if (deleteStatus === DELETE_STATUS.FAILED) {
      return;
    }

    if (!isError) {
      return;
    }

    setDeleteStatus(DELETE_STATUS.FAILED);
  }, [isError, deleteStatus]);

  useEffect(() => {
    if (deleteStatus === DELETE_STATUS.SUCCEEDED) {
      return;
    }

    if (!isSuccess) {
      return;
    }

    setDeleteStatus(DELETE_STATUS.SUCCEEDED);
    navigateToRoute('instrumentList');
  }, [deleteStatus, isSuccess, navigateToRoute]);

  useEffect(() => {
    if (deleteStatus === DELETE_STATUS.FAILED && deletionError && modalOpen) {
      showFeedback({
        type: 'error',
        submissionError: deletionError,
        visualizationType: 'modal',
        onClose: handleClose,
      });
    }
  }, [modalOpen, showFeedback, deletionError, deleteStatus]);

  return (
    <ConfirmDeleteDialog
      open={open}
      onClose={onClose}
      onCancel={onCancel}
      modalName={modalName}
      deleteStatus={deleteStatus}
      handleDelete={handleDelete}
    />
  );
}
