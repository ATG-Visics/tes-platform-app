import { useOutletContext } from 'react-router-dom';
import { CrudListPageToolbar, CrudTable } from '@tes/crud';
import { useFetchList } from '../../hooks';
import { Grid } from '@mui/material';
import { SampleMediaCrudTableRow } from '../../ui';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useCustomNavigate } from '@tes/router';

export function SampleMediaListPage() {
  const { navigateToRoute } = useCustomNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHasBackButton] =
    useOutletContext<[boolean, Dispatch<SetStateAction<boolean>>]>();

  useEffect(() => setHasBackButton(false), [setHasBackButton]);

  const headCells = [
    {
      id: 'title',
      label: 'Name',
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
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <CrudListPageToolbar
          title="Sample media"
          addLabel="New sample media"
          searchFieldPlaceholder="Search on sample media"
          searchValue={search}
          onSearchChange={onSearchChange}
          onAddClick={() => {
            navigateToRoute('sampleMediaCreate');
          }}
        />
      </Grid>

      <Grid item xs={12}>
        {isSuccess && !isLoading && (
          <CrudTable
            title="Sample media"
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
            ItemRowComponent={SampleMediaCrudTableRow}
          />
        )}
      </Grid>
    </Grid>
  );
}
