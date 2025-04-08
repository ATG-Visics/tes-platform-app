import { DialogProps } from '@mui/material';
import { useDeleteClientMutation } from '../../api';
import { useCallback, useEffect, useState } from 'react';
import { ConfirmDeleteDialog } from '../../ui';
import { useCustomNavigate } from '@tes/router';

export enum DELETE_STATUS {
  IDLE = 'idle',
  LOADING = 'saving',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function ClientDeletePage(
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
  const [deleteClient, { isError, isSuccess }] = useDeleteClientMutation();

  const handleDelete = useCallback(() => {
    if (!recordId) {
      return;
    }
    setDeleteStatus(DELETE_STATUS.LOADING);

    deleteClient(recordId);
  }, [deleteClient, recordId]);

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
    navigateToRoute('clientList');
  }, [deleteStatus, isSuccess, navigateToRoute]);

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
