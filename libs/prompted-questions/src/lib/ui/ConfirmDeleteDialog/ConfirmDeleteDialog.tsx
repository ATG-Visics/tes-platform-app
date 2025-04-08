import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from '@mui/material';

interface IProps extends Pick<DialogProps, 'open' | 'onClose'> {
  onConfirm?: () => void;
  onCancel: () => void;
  modalName: string | null;
  handleDelete: () => void;
}

export type ConfirmDeleteDialogProps = IProps;

export function ConfirmDeleteDialog(props: IProps) {
  const { open, onClose, onCancel, modalName, handleDelete } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you really want to delete {modalName}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" autoFocus onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleDelete}>
          Confirm delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
