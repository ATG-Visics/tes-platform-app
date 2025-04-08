import { Box, Chip, ListItem, ListItemText, Typography } from '@mui/material';

interface IProps {
  title: string;
  items: Array<{ title: string }> | undefined;
}

export function PPEInfoChips(props: IProps) {
  const { items, title } = props;
  return (
    <ListItem
      sx={{
        p: 0,
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'flex-start',
      }}
    >
      <ListItemText sx={{ mb: 0 }}>
        <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
      </ListItemText>
      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <Chip
              key={index}
              label={item.title || `Item ${index + 1}`}
              sx={{ backgroundColor: '#f5f5f5' }}
            />
          ))
        ) : (
          <Typography sx={{ color: 'gray' }}> - </Typography>
        )}
      </Box>
    </ListItem>
  );
}
