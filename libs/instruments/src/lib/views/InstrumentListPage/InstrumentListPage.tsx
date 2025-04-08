import { useOutletContext } from 'react-router-dom';
import { CrudListPageToolbar, CrudTable } from '@tes/crud';
import { useFetchList } from '../../hooks';
import { Box, Grid } from '@mui/material';
import { InstrumentCrudTableRow } from '../../ui';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useCustomNavigate } from '@tes/router';

export function InstrumentListPage() {
  const { navigateToRoute } = useCustomNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHasBackButton] =
    useOutletContext<[boolean, Dispatch<SetStateAction<boolean>>]>();

  useEffect(() => setHasBackButton(false), [setHasBackButton]);

  const headCells = [
    {
      id: 'title',
      label: 'Instrument name',
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
            title="Instrument"
            addLabel="New Instrument"
            searchFieldPlaceholder="Search Instrument"
            searchValue={search}
            onSearchChange={onSearchChange}
            onAddClick={() => {
              navigateToRoute('instrumentCreate');
            }}
          />
        </Grid>

        <Grid item xs={12}>
          {isSuccess && !isLoading && (
            <CrudTable
              title="Instrument"
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
              ItemRowComponent={InstrumentCrudTableRow}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
