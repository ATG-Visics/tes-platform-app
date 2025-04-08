import { ListItem, ListItemText, Divider } from '@mui/material';

interface IProps {
  title: string;
}

export function InstrumentDetailListItem(props: IProps) {
  const { title } = props;

  return (
    <>
      <ListItem>
        <ListItemText primary={title} />
      </ListItem>
      <Divider variant="middle" />
    </>
  );
}
