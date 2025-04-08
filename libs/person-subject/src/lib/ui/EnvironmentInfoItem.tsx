import { ListItem, ListItemText, Typography } from '@mui/material';

interface IProps {
  title: string;
  item?: { title: string };
}

export function EnvironmentInfoItem(props: IProps) {
  const { item, title } = props;
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
      <ListItemText sx={{ mt: 0 }}>{item ? item.title : ' - '}</ListItemText>
    </ListItem>
  );
}
