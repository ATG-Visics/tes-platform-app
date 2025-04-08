import { Box, Button, Fade, Modal, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { ReactNode } from 'react';

interface IProps {
  title?: string;
  description: string | ReactNode;
  errorList?: { [key: string]: [string] } | null;
  errorListExtra?: { [key: string]: string } | null;
  open: boolean;
  handleClose: () => void;
  showButton?: boolean;
}

export type TransitionsModalProps = IProps;

export function TransitionsModal(props: IProps) {
  const {
    open,
    handleClose,
    title,
    description,
    showButton,
    errorList,
    errorListExtra,
  } = props;

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={(_event, reason) => {
        if (reason === 'escapeKeyDown') {
          handleClose();
        }
      }}
      closeAfterTransition
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: '40px',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography id="transition-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            {description}
          </Typography>
          {errorList && (
            <Box sx={{ mt: 2, minWidth: '200px' }}>
              {Object.entries(errorList).map(([key, value]) => (
                <Box sx={{ mt: 1 }} key={key + value}>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {errorListExtra ? errorListExtra[key] : key}
                  </Typography>
                  {Array.isArray(value) ? (
                    value.map((error) =>
                      typeof error === 'object' ? (
                        Object.entries(error).map(([label, deepError]) => (
                          <Box sx={{ pl: 3, mt: 2 }}>
                            <Typography key={key + '-' + deepError}>
                              <Typography fontWeight="bold">{label}</Typography>
                              {deepError}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography key={key + '-' + error}>{error}</Typography>
                      ),
                    )
                  ) : (
                    <Typography>{value}</Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
          {showButton && (
            <>
              <Box mb={4} />
              <Button variant="contained" onClick={handleClose}>
                <FormattedMessage
                  id="modal.button.fullscreenClosed"
                  defaultMessage="Close Modal"
                />
              </Button>
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}
