import { ListItem, ListItemText } from '@mui/material';

interface IProps {
  item: { id: string; title: string; jobNumber: string };
  onItemClick: (id: string | number) => void;
}

export type FallbackListItemProps = IProps;

export function FallbackListItem(props: IProps) {
  const { item, onItemClick } = props;

  return (
    <ListItem
      key={item.id}
      sx={{ paddingLeft: 0 }}
      onClick={() => onItemClick(item.id)}
    >
      <ListItemText primary={item.title} secondary={item.jobNumber} />
    </ListItem>
  );
}
