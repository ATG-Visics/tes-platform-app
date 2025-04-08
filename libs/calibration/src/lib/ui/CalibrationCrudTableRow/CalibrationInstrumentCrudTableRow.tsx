import { TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ICalibrationListItem } from '../../api';
import { format } from 'date-fns';
import { RouterLink } from '@tes/router';

interface IProps {
  item: ICalibrationListItem;
  isSelected?: boolean;
  onToggleSelect?: (id: string | number) => void;
}

export type CalibrationInstrumentCrudTableRowProps = IProps;

const useStyles = makeStyles(({ palette }) => ({
  link: {
    textDecoration: 'none',
    color: palette.text.secondary,
  },
}));

export function CalibrationInstrumentCrudTableRow(props: IProps) {
  const classes = useStyles();
  const { item } = props;
  return (
    <>
      <TableCell>
        <RouterLink
          name={'calibrationDetail'}
          params={{ id: item.id }}
          className={classes.link}
        >
          {item.title}
        </RouterLink>
      </TableCell>
      <TableCell>
        <RouterLink
          name={'calibrationDetail'}
          params={{ id: item.id }}
          className={classes.link}
        >
          {format(new Date(item.updatedAt), 'MMM dd, y')}
        </RouterLink>
      </TableCell>
    </>
  );
}
