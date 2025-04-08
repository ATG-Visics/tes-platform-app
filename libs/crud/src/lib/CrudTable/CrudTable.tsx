import {
  Box,
  Paper,
  SxProps,
  Table as TableComponent,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { SwitchBaseProps } from '@mui/material/internal/SwitchBase';
import { TableCellProps } from '@mui/material/TableCell/TableCell';
import React, { ComponentType, useMemo } from 'react';

import { CrudLoading } from '../CrudLoading';
import { CrudNoItems } from '../CrudNoItems';
import { SelectionState } from '../types';
import { CrudTableHead } from '../CrudTableHead';
import { CrudTableToolbar } from '../CrudTableToolbar';
import * as colors from '@tes/ui/colors';

interface IProps<T> {
  title: string;
  headCells: Array<{ label: string; id: string | number } & TableCellProps>;
  ItemRowComponent: ComponentType<{
    item: T;
    onToggleSelect?: (id: string | number) => void;
    isSelected?: boolean;
  }>;
  itemList: Array<T>;
  isFetching: boolean;
  isLoading: boolean;
  itemCount: number;
  itemsPerPage: number;
  selection?: Record<string | number, boolean>;
  onToggleSelect?: (id: string | number) => void;
  onRowClick?: (item: T) => void;
  selectionState?: SelectionState;
  page: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => void;
  onRowsPerPageChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  onToggleSelectAll?: SwitchBaseProps['onChange'];
  onUpdateOrdering: (field: string | number) => void;
  orderBy: string;
  extraSx?: SxProps;
}

export type CrudTableProps<T> = IProps<T>;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxWidth: 1280,
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  tableBody: {
    transition: 'opacity .2s',
  },
}));

/**
 * The CRUD Table is used in the overview page of default
 * crud-systems.
 */
export function CrudTable<T extends { id: string | number }>(props: IProps<T>) {
  const classes = useStyles();
  const {
    title,
    headCells,
    ItemRowComponent,
    itemList,
    isFetching,
    isLoading,
    itemCount,
    itemsPerPage,
    selectionState,
    onToggleSelect,
    onRowClick,
    selection,
    page,
    onPageChange,
    onRowsPerPageChange,
    onToggleSelectAll,
    extraSx,
  } = props;

  const numSelected = useMemo(
    () => (selection ? Object.keys(selection).length : 0),
    [selection],
  );

  const sx = {
    width: '100%',
    minHeight: '50vh',
    height: '100%',
    overflow: 'scroll',
    ...extraSx,
  };

  return (
    <Box>
      <Paper sx={sx}>
        <CrudTableToolbar numSelected={numSelected} />
        {isFetching && <CrudLoading />}
        {!isLoading && itemCount < 1 && <CrudNoItems />}
        {!isLoading && itemCount > 0 && (
          <TableContainer>
            <TableComponent className={classes.table}>
              <CrudTableHead
                title={title}
                headCells={headCells}
                selectionState={selectionState}
                onToggleSelectAll={onToggleSelectAll}
              />
              <TableBody
                className={classes.tableBody}
                sx={{ opacity: isFetching ? 0.5 : 1 }}
              >
                {itemList.map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => {
                      onRowClick && onRowClick(item);
                    }}
                    sx={onRowClick && { cursor: 'pointer' }}
                  >
                    <ItemRowComponent
                      item={item}
                      onToggleSelect={onToggleSelect}
                      isSelected={selection ? selection[item.id] : false}
                    />
                  </TableRow>
                ))}
              </TableBody>
            </TableComponent>
          </TableContainer>
        )}
        {!isLoading && itemCount > 0 && (
          <TablePagination
            sx={{ color: colors.accent1['700'] }}
            component="div"
            count={itemCount}
            rowsPerPage={itemsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        )}
      </Paper>
    </Box>
  );
}
