import { styled, Box } from '@mui/material';

export const Stacked = styled(Box)(({ theme: { spacing } }) => ({
  display: 'inline-flex',
  flexDirection: 'column',

  '& > * + *': {
    marginTop: spacing(2),
  },
}));
