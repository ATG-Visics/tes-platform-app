import { useJsonForms } from '@jsonforms/react';
import {
  Hidden,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  ArrayLayoutProps,
  Dispatch,
  mapDispatchToCellProps,
  Paths,
  Resolve,
} from '@jsonforms/core';
import range from 'lodash/range';
import { HazardListSelectRow } from './HazardListSelectRow';

interface EmptyTableProps {
  numColumns: number;
}

const EmptyTableRow = ({ numColumns }: EmptyTableProps) => (
  <TableRow>
    <TableCell sx={{ border: 'none' }} colSpan={numColumns}>
      <Typography align="center">No hazards available.</Typography>
    </TableCell>
  </TableRow>
);

export function HazardsListSelectLayout(props: ArrayLayoutProps) {
  const { path, visible, enabled, data, label } = props;

  const ctx = useJsonForms();

  return (
    <Hidden xsUp={!visible}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '5%' }}></TableCell>
            <TableCell sx={{ width: '30%' }}>{label}</TableCell>
            <TableCell>OEL | Source</TableCell>
            <TableCell>Action Level | Source</TableCell>
            <TableCell sx={{ width: '15%' }}>No of Samples</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data < 1 && <EmptyTableRow numColumns={5} />}

          {range(data).map((index: number) => {
            const childPath = Paths.compose(path, `${index}`);
            const childData = Resolve.data(ctx?.core?.data, childPath);
            const dispatch = ctx.dispatch as Dispatch;
            const { handleChange } = mapDispatchToCellProps(dispatch);

            return (
              <HazardListSelectRow
                key={childPath}
                path={childPath}
                item={childData}
                handleChange={handleChange}
                enabled={enabled}
              />
            );
          })}
        </TableBody>
      </Table>
    </Hidden>
  );
}
