import { DialogProps } from '@mui/material';
import { useDeleteProjectMutation } from '../../api';
import { useCallback, useEffect, useState } from 'react';
import { ConfirmDeleteDialog } from '../../ui';
import { useCustomNavigate } from '@tes/router';
import { TransitionsModal } from '@tes/ui/core';

export enum DELETE_STATUS {
  IDLE = 'idle',
  LOADING = 'saving',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function ProjectDeletePage(
  props: Pick<DialogProps, 'open' | 'onClose'> & {
    onConfirm?: () => void;
    onCancel: () => void;
    modalName: string | null;
    recordId?: string;
  },
) {
  const { navigateToRoute } = useCustomNavigate();
  const { open, onClose, onCancel, recordId, modalName } = props;
  const [errorModal, setErrorModal] = useState(true);
  const [deleteStatus, setDeleteStatus] = useState<DELETE_STATUS>(
    DELETE_STATUS.IDLE,
  );
  const [deleteProject, { isError, isSuccess }] = useDeleteProjectMutation();

  const handleDelete = useCallback(() => {
    if (!recordId) {
      return;
    }
    setDeleteStatus(DELETE_STATUS.LOADING);
    setErrorModal(true);

    deleteProject(recordId);
  }, [deleteProject, recordId]);

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
    navigateToRoute('projectList');
  }, [deleteStatus, isSuccess, navigateToRoute]);

  return (
    <>
      {isError && (
        <TransitionsModal
          title="An error occurred on the server"
          description="The project cannot be deleted, there are samples connected to the project."
          showButton
          open={errorModal}
          handleClose={() => setErrorModal(false)}
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
