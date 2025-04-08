import { TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ISampleMediaListItem } from '../../api';
import { RouterLink } from '@tes/router';

interface IProps {
  item: ISampleMediaListItem;
  isSelected?: boolean;
  onToggleSelect?: (id: string | number) => void;
}

const useStyles = makeStyles(({ palette }) => ({
  link: {
    textDecoration: 'none',
    color: palette.text.secondary,
  },
}));

export function SampleMediaCrudTableRow(props: IProps) {
  const classes = useStyles();
  const { item } = props;
  const route = {
    name: 'sampleMediaUpdate',
    params: {
      id: item.id,
    },
  };
  return (
    <TableCell>
      <RouterLink
        name={route.name}
        params={route.params}
        className={classes.link}
      >
        {item.title}
      </RouterLink>
    </TableCell>
  );
}
