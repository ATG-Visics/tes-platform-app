import { Box, LinearProgress } from '@mui/material';

export function CrudLoading() {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );
}
