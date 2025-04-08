import { Box, CircularProgress, Modal, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

interface IProps {
  title: string;
}

export function CrudLoadingModal(props: IProps) {
  const { title } = props;

  return (
    <Modal open={true} title={title} aria-labelledby="modal-modal-title">
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          gutterBottom={true}
        >
          {title}
        </Typography>
        <CircularProgress />
      </Box>
    </Modal>
  );
}
