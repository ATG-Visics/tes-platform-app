import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogProps,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { DELETE_STATUS } from '../../views/ClientDeletePage';

export function ConfirmDeleteDialog({
  open,
  onClose,
  onCancel,
  modalName,
  deleteStatus,
  handleDelete,
}: Pick<DialogProps, 'open' | 'onClose'> & {
  onConfirm?: () => void;
  onCancel: () => void;
  modalName: string | null;
  deleteStatus: DELETE_STATUS;
  handleDelete: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you really want to delete {modalName}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" autoFocus onClick={onCancel}>
          Cancel
        </Button>
        {deleteStatus === DELETE_STATUS.LOADING ? (
          <LoadingButton
            loading
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="outlined"
          >
            Delete
          </LoadingButton>
        ) : (
          <Button variant="contained" color="primary" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
