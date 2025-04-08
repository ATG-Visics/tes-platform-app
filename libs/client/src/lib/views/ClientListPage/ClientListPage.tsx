import { useOutletContext } from 'react-router-dom';
import { CrudListPageToolbar, CrudTable } from '@tes/crud';
import { useFetchList } from '../../hooks';
import { Grid } from '@mui/material';
import { ClientCrudTableRow } from '../../ui';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsClient } from '@tes/accounts';
import { useCustomNavigate } from '@tes/router';

export function ClientListPage() {
  const { navigateToRoute } = useCustomNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHasBackButton] =
    useOutletContext<[boolean, Dispatch<SetStateAction<boolean>>]>();

  useEffect(() => setHasBackButton(false), [setHasBackButton]);

  const isClient = useSelector(selectIsClient);

  const headCells = [
    {
      id: 'title',
      label: 'Name',
    },
    {
      id: 'address',
      label: 'Address',
    },
    {
      id: 'recent-activity',
      label: 'Recent Activity',
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
          showAddButton={!isClient}
          title="Client"
          addLabel="New client"
          searchFieldPlaceholder="Search on client"
          searchValue={search}
          onSearchChange={onSearchChange}
          onAddClick={() => {
            navigateToRoute('clientCreate');
          }}
        />
      </Grid>

      <Grid item xs={12}>
        {isSuccess && !isLoading && (
          <CrudTable
            title="Client"
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
            ItemRowComponent={ClientCrudTableRow}
          />
        )}
      </Grid>
    </Grid>
  );
}
