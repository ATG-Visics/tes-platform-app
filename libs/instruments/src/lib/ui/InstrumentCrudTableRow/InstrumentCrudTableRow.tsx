import { TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { IInstrumentListItem } from '../../api';
import { format } from 'date-fns';
import { RouterLink } from '@tes/router';

interface IProps {
  item: IInstrumentListItem;
  isSelected?: boolean;
  onToggleSelect?: (id: string | number) => void;
}

const useStyles = makeStyles(({ palette }) => ({
  link: {
    textDecoration: 'none',
    color: palette.text.secondary,
  },
}));

export function InstrumentCrudTableRow(props: IProps) {
  const classes = useStyles();
  const { item } = props;
  const route = {
    name: 'instrumentDetail',
    params: {
      id: item.id,
    },
  };
  return (
    <>
      <TableCell>
        <RouterLink
          name={route.name}
          params={route.params}
          className={classes.link}
        >
          {item.title}
        </RouterLink>
      </TableCell>
      <TableCell>
        <RouterLink
          name={route.name}
          params={route.params}
          className={classes.link}
        >
          {format(new Date(item.updatedAt), 'MMM dd, y')}
        </RouterLink>
      </TableCell>
    </>
  );
}
