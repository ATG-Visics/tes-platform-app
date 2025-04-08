import { IconButton, ListItem, ListItemText, Divider } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { ISampleMedia } from '../../api/SampleMediaApie';

interface IProps {
  item: ISampleMedia;
  onItemClick: (id: string | number) => void;
}

export function SampleMediaDetailListItem(props: IProps) {
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
        <ListItemText primary={item.title} />
      </ListItem>
      <Divider variant="middle" />
    </>
  );
}
