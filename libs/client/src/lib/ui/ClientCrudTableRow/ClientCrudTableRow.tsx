import { TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { format } from 'date-fns';
import { IClient } from '../../api';
import { RouterLink } from '@tes/router';

interface IProps {
  item: IClient;
  isSelected?: boolean;
  onToggleSelect?: (id: string | number) => void;
}

const useStyles = makeStyles(({ palette }) => ({
  link: {
    textDecoration: 'none',
    color: palette.text.secondary,
  },
}));

export function ClientCrudTableRow(props: IProps) {
  const classes = useStyles();
  const { item } = props;
  return (
    <>
      <TableCell>
        <RouterLink
          name={'clientDetail'}
          className={classes.link}
          params={{ id: item.id }}
        >
          {item.title}
        </RouterLink>
      </TableCell>
      <TableCell>
        <RouterLink
          name={'clientDetail'}
          className={classes.link}
          params={{ id: item.id }}
        >
          {item.city}, {item.country}
        </RouterLink>
      </TableCell>
      <TableCell>
        <RouterLink
          name={'clientDetail'}
          className={classes.link}
          params={{ id: item.id }}
        >
          {format(new Date(item.updatedAt), 'MMM dd, y')}
        </RouterLink>
      </TableCell>
    </>
  );
}
