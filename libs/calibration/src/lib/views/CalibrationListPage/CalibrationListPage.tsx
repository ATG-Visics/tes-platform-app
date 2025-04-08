import { useOutletContext } from 'react-router-dom';
import { CrudListPageToolbar, CrudTable } from '@tes/crud';
import { useFetchList } from '../../hooks';
import { Box, Grid } from '@mui/material';
import { CalibrationInstrumentCrudTableRow } from '../../ui';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useCustomNavigate } from '@tes/router';

export function CalibrationListPage() {
  const { navigateToRoute } = useCustomNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHasBackButton] =
    useOutletContext<[boolean, Dispatch<SetStateAction<boolean>>]>();

  useEffect(() => setHasBackButton(false), [setHasBackButton]);

  const headCells = [
    {
      id: 'title',
      label: 'Calibration name',
    },
    {
      id: 'recent-activity',
      label: 'Recent activity',
    },
  ];

  const {
    isLoading,
    isFetching,
    isSuccess,
    itemCount,
    itemList,

    itemsPerPage,
    page,
    onRowPerPageChange,
    onPageChange,

    search,
    debouncedSearch,
    onSearchChange,

    orderBy,
    onUpdateOrdering,

    selection,
    selectionState,
    onToggleSelectAll,
    onToggleSelect,
  } = useFetchList();

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CrudListPageToolbar
            title="Calibration devices"
            addLabel="New Calibration device"
            searchFieldPlaceholder="Search calibration device"
            searchValue={search}
            onSearchChange={onSearchChange}
            onAddClick={() => {
              navigateToRoute('calibrationCreate');
            }}
          />
        </Grid>

        <Grid item xs={12}>
          {isSuccess && !isLoading && (
            <CrudTable
              title="Calibration"
              headCells={headCells}
              itemsPerPage={itemsPerPage}
              page={page}
              onRowsPerPageChange={onRowPerPageChange}
              onPageChange={onPageChange}
              orderBy={orderBy}
              onUpdateOrdering={onUpdateOrdering}
              isLoading={isLoading}
              isFetching={isFetching || search !== debouncedSearch}
              itemCount={itemCount}
              itemList={itemList}
              selection={selection}
              selectionState={selectionState}
              onToggleSelectAll={onToggleSelectAll}
              onToggleSelect={onToggleSelect}
              ItemRowComponent={CalibrationInstrumentCrudTableRow}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
