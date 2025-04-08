import { DialogProps } from '@mui/material';
import { useDeleteProjectLocationMutation } from '../../api';
import { useCallback, useState } from 'react';
import { ConfirmDeleteDialog, TransitionsModal } from '@tes/ui/core';
import { ISubmissionError } from '@tes/utils-hooks';
import { useCustomNavigate } from '@tes/router';

export enum DELETE_STATUS {
  IDLE = 'idle',
  LOADING = 'saving',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function ProjectLocationDeletePage(
  props: Pick<DialogProps, 'open' | 'onClose'> & {
    onConfirm?: () => void;
    onCancel: () => void;
    modalName: string | null;
    recordId?: string;
  },
) {
  const { navigateToRoute } = useCustomNavigate();
  const { open, onClose, onCancel, recordId, modalName } = props;
  const [deleteStatus, setDeleteStatus] = useState<DELETE_STATUS>(
    DELETE_STATUS.IDLE,
  );
  const [_, setSubmissionError] = useState<null | ISubmissionError>(null);

  const handleClose = useCallback(() => {
    setDeleteStatus(DELETE_STATUS.IDLE);
  }, []);

  const [deleteProject] = useDeleteProjectLocationMutation();

  const handleDelete = useCallback(() => {
    if (!recordId) {
      return;
    }
    setDeleteStatus(DELETE_STATUS.LOADING);

    deleteProject(recordId)
      .unwrap()
      .then(
        () => {
          setDeleteStatus(DELETE_STATUS.SUCCEEDED);
          navigateToRoute('projectList');
        },
        (error) => {
          setDeleteStatus(DELETE_STATUS.FAILED);
          setSubmissionError(error);
        },
      );
  }, [deleteProject, navigateToRoute, recordId]);

  return (
    <>
      {deleteStatus === DELETE_STATUS.FAILED && (
        <TransitionsModal
          title={"The location can't be removed."}
          description="Please check if all the samples are deleted"
          showButton
          open={true}
          handleClose={handleClose}
        />
      )}

      <ConfirmDeleteDialog
        open={open}
        onClose={onClose}
        onCancel={onCancel}
        modalName={modalName}
        deleteStatus={deleteStatus}
        handleDelete={handleDelete}
      />
    </>
  );
}
