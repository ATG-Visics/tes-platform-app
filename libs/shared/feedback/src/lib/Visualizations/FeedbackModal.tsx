import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

let showModalFunction: (
  title: string,
  subtitle: string,
  type: string,
  details: string[],
  onClose: (() => void) | null,
) => void;

interface IProps {
  title: string;
  subtitle: string;
  type: string;
  details: string[];
  onClose: (() => void) | null;
}

export function showModal({ title, subtitle, type, details, onClose }: IProps) {
  if (showModalFunction) {
    showModalFunction(title, subtitle, type, details, onClose);
  }
}

export function FeedbackModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [currentSubtitle, setCurrentSubtitle] = useState<string | null>(null);
  const [currentType, setCurrentType] = useState<string | null>(null);
  const [currentDetails, setCurrentDetails] = useState<string[] | null>(null);
  const [currentOnClose, setCurrentOnClose] = useState<(() => void) | null>(
    null,
  );

  showModalFunction = (
    title: string,
    subtitle: string,
    type: string,
    details: string[],
    onClose: (() => void) | null,
  ) => {
    setCurrentTitle(title);
    setCurrentSubtitle(subtitle);
    setCurrentDetails(details);
    setCurrentType(type);
    setModalOpen(true);
    setCurrentOnClose(onClose);
  };

  const handleClose = () => {
    setModalOpen(false);
    setCurrentSubtitle(null);
    setCurrentType(null);
    if (currentOnClose) {
      currentOnClose();
    }
    setCurrentOnClose(null);
  };

  return (
    <Dialog open={modalOpen} onClose={handleClose}>
      {currentType === 'error' && (
        <DialogTitle>
          <Alert severity="error">
            <AlertTitle>{currentTitle}</AlertTitle>
            {currentSubtitle}
          </Alert>
        </DialogTitle>
      )}

      {currentType !== 'error' && currentSubtitle && (
        <>
          <DialogTitle>{currentTitle}</DialogTitle>
          <DialogContent>{currentSubtitle}</DialogContent>
        </>
      )}

      <DialogContent>
        {currentDetails && (
          <List>
            {currentDetails.map((detailRow, index) => (
              <ListItem key={index}>
                <ListItemText primary={detailRow} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
