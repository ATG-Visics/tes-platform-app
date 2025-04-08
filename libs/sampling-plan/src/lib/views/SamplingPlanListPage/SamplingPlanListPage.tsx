import { Box, Grid, Modal } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModalTitleBar } from '@tes/ui/core';
import { CrudListPageToolbar, CrudTable } from '@tes/crud';

import { useFetchList } from '../../hooks';
import { SamplingPlanCrudTableRow } from '../../ui';
import { useCustomNavigate } from '@tes/router';

export function SamplingPlanListModal() {
  const [open] = useState<boolean>(true);
  const { navigateToRoute } = useCustomNavigate();

  const { id = '' } = useParams();

  const headCells = [
    { id: 'name', label: 'Name / task description' },
    { id: 'sampleType ', label: 'Sample Type' },
    { id: 'hazards', label: 'Hazards' },
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
  } = useFetchList(id);

  const onClose = () => {
    navigateToRoute('projectOverview', { params: { id } });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="sampling-plan-modal-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '900px',
          height: 'calc(100% - 24px)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          overflow: 'auto',
        }}
      >
        <ModalTitleBar title={'Sampling Plan'} onClose={onClose} />
        <Box sx={{ mx: 4, mb: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CrudListPageToolbar
                showAddButton
                title="Scenarios"
                addLabel="New scenario"
                searchFieldPlaceholder="Search by scenario name"
                searchValue={search}
                onSearchChange={onSearchChange}
                onAddClick={() => {
                  navigateToRoute('samplingPlanCreate', { params: { id } });
                }}
                hasExtraButton
                extraButtonTitle="Import/Export"
                extraButtonHandler={() =>
                  navigateToRoute('samplingPlanImportExport')
                }
              />
            </Grid>
            <Grid item xs={12}>
              {isSuccess && !isLoading && (
                <CrudTable
                  title="Scenarios"
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
                  ItemRowComponent={SamplingPlanCrudTableRow}
                  onRowClick={(item) => {
                    navigateToRoute('samplingPlanUpdate', {
                      params: { id, samplingPlanId: item.id },
                    });
                  }}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
}
