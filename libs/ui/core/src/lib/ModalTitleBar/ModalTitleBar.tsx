import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';

import {
  ChevronLeft as ChevronLeftIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface IProps {
  title: string;
  onClose: () => void;
}

export function ModalTitleBar({ title, onClose }: IProps) {
  return (
    <AppBar color="secondary" elevation={0} position="sticky">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onClose} sx={{ pl: 0, textTransform: 'none' }}>
          <ChevronLeftIcon sx={{ color: '#fff' }} />
          <Typography variant="h5" color="#fff">
            {title}
          </Typography>
        </Button>
        <IconButton onClick={onClose}>
          <CloseIcon sx={{ fill: '#fff' }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
