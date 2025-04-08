import { TableCell, TableHead, TableRow, TableCellProps } from '@mui/material';
import { SwitchBaseProps } from '@mui/material/internal/SwitchBase';

import { SelectionState } from '../types';
import * as colors from '@tes/ui/colors';

interface IProps {
  title: string;
  headCells: Array<{ id: string | number; label: string } & TableCellProps>;
  selectionState?: SelectionState;
  onToggleSelectAll: SwitchBaseProps['onChange'];
}

export type CrudTableHeadProps = IProps;

export function CrudTableHead(props: IProps) {
  const { title, headCells } = props;

  return (
    <TableHead aria-labelledby={title} aria-label={title}>
      <TableRow>
        {headCells.map(({ id, label, ...cellProps }) => (
          <TableCell
            key={id}
            {...cellProps}
            sx={{ color: colors.accent1['700'] }}
          >
            {label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
