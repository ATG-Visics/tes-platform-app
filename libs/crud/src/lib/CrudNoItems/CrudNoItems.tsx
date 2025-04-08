import { Box, Typography } from '@mui/material';

export function CrudNoItems() {
  return (
    <Box p={2}>
      <Typography variant="body1">No items found yet.</Typography>
    </Box>
  );
}
