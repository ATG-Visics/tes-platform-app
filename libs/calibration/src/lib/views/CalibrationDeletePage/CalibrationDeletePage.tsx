import { DialogProps } from '@mui/material';
import { useDeleteCalibrationDevicesMutation } from '../../api';
import { useCallback, useEffect, useState } from 'react';
import { ConfirmDeleteDialog } from '../../ui';
import { ISubmissionError } from '@tes/utils-hooks';
import { TransitionsModal } from '@tes/ui/core';
import { useCustomNavigate } from '@tes/router';

export enum DELETE_STATUS {
  IDLE = 'idle',
  LOADING = 'saving',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function CalibrationDeletePage(
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
  const [deleteCalibrationDevice, { isError, isSuccess }] =
    useDeleteCalibrationDevicesMutation();

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

    deleteCalibrationDevice(recordId)
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
  }, [deleteCalibrationDevice, recordId]);

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
    navigateToRoute('calibrationList');
  }, [deleteStatus, isSuccess, navigateToRoute]);

  return (
    <>
      {deleteStatus === DELETE_STATUS.FAILED && (
        <TransitionsModal
          title="There is a error with the server"
          description="Try again to delete calibration device"
          showButton
          errorList={deletionError?.data as { [key: string]: [string] }}
          open={modalOpen}
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
