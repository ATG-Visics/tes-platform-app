import { useOutletContext } from 'react-router-dom';
import { CrudListPageToolbar, CrudTable } from '@tes/crud';
import { useFetchList } from '../../hooks';
import { Grid } from '@mui/material';
import { QuestionCrudTableRow } from '../../ui';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsClient } from '@tes/accounts';
import { useCustomNavigate } from '@tes/router';

export function QuestionGroupListPage() {
  const { navigateToRoute } = useCustomNavigate();
  const isClient = useSelector(selectIsClient);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHasBackButton] =
    useOutletContext<[boolean, Dispatch<SetStateAction<boolean>>]>();

  useEffect(() => setHasBackButton(false), [setHasBackButton]);

  const headCells = [
    {
      id: 'title',
      label: 'Title',
    },
    {
      id: 'questions',
      label: 'Questions',
    },
    {
      id: 'groupType',
      label: 'Group type',
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
          title="Question groups"
          addLabel="New group"
          searchFieldPlaceholder="Search question groups"
          searchValue={search}
          onSearchChange={onSearchChange}
          onAddClick={() => {
            navigateToRoute('promptedQuestionsCreate');
          }}
        />
      </Grid>

      <Grid item xs={12}>
        {isSuccess && !isLoading && (
          <CrudTable
            title="Prompted question groups"
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
            ItemRowComponent={QuestionCrudTableRow}
          />
        )}
      </Grid>
    </Grid>
  );
}
