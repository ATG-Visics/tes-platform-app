import { IClientProjectItem } from '../../api';
import { IconButton, ListItem, ListItemText, Divider } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

interface IProps {
  item: IClientProjectItem;
  onItemClick: (id: string | number) => void;
}

export function ClientDetailListItem(props: IProps) {
  const { item, onItemClick } = props;

  return (
    <>
      <ListItem
        key={item.id}
        sx={{ paddingLeft: 0, cursor: 'pointer' }}
        onClick={() => onItemClick(item.id)}
        secondaryAction={
          <IconButton>
            <ArrowForwardIcon />
          </IconButton>
        }
      >
        <ListItemText
          primary={item.title}
          secondary={`Job number: ${item.jobNumber}`}
        />
      </ListItem>
      <Divider variant="middle" />
    </>
  );
}
