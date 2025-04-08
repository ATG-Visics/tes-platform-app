import { useOutletContext } from 'react-router-dom';
import { CrudListPageToolbar, CrudTable } from '@tes/crud';
import { useFetchList } from '../../hooks';
import { Grid } from '@mui/material';
import { ProjectCrudTableRow } from '../../ui';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsClient } from '@tes/accounts';
import { useCustomNavigate } from '@tes/router';

export function ProjectListPage() {
  const { navigateToRoute } = useCustomNavigate();
  const isClient = useSelector(selectIsClient);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHasBackButton] =
    useOutletContext<[boolean, Dispatch<SetStateAction<boolean>>]>();

  useEffect(() => setHasBackButton(false), [setHasBackButton]);

  const headCells = [
    {
      id: 'title',
      label: 'Project name',
    },
    {
      id: 'job-number',
      label: 'Job number',
    },
    {
      id: 'client',
      label: 'Client name',
    },
    {
      id: 'recent-activity',
      label: 'Recent activity',
    },
    {
      id: '',
      label: 'Actions',
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
          title="Projects"
          addLabel="New Project"
          searchFieldPlaceholder="Search projects"
          searchValue={search}
          onSearchChange={onSearchChange}
          onAddClick={() => {
            navigateToRoute('projectCreate');
          }}
        />
      </Grid>

      <Grid item xs={12}>
        {isSuccess && !isLoading && (
          <CrudTable
            title="Project"
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
            ItemRowComponent={ProjectCrudTableRow}
          />
        )}
      </Grid>
    </Grid>
  );
}
