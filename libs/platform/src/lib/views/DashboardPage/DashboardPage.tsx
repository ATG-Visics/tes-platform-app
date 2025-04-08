import {
  Autocomplete,
  Box,
  Checkbox,
  Fade,
  FormGroup,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import FullscreenIcon from '@mui/icons-material/ZoomOutMap';
import FullscreenExitIcon from '@mui/icons-material/ZoomInMap';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DummyRowItem, HorizontalBarChart, ResultTableItemRow } from '../../ui';
import { PieChart } from '../../ui/PieChart';
import { usePieChartResults } from '../../hooks/usePieChartResults';
import {
  RESULT_STATUS,
  useModalResultList,
  useOELResultsByClient,
  useProjectResultsOverview,
} from '../../hooks';
import { useMemo, useState } from 'react';
import { CrudListPageToolbar, CrudTable } from '@tes/crud';
import MultiSelect from '../../ui/MultiSelect/MultiSelect';

export function DashboardPage() {
  const {
    setSelectValue,

    inputValue,
    setInputValue,

    toggleOpen,

    formattedHazardList,
    findOption,
    hazardResponse,
    clientResponse,

    onToggleSelectClients,
    onToggleSelectSampleType,

    startDate: pieChartStartDate,
    handleStartDate: pieChartHandleStartDate,

    endDate: pieChartEndDate,
    handleEndDate: pieChartHandleEndDate,
  } = usePieChartResults();

  const {
    status,
    chartData,

    isFullscreen,
    handleFullScreen,

    startDate,
    handleStartDate,

    endDate,
    handleEndDate,
  } = useOELResultsByClient();

  const {
    modalState,

    handleOpenModal,
    toggleModal,
    itemList,
    itemCount,
    isLoading,
    isFetching,

    search,
    debouncedSearch,
    onSearchChange,

    orderBy,
    onUpdateOrdering,

    itemsPerPage,
    page,
    onRowPerPageChange,
    onPageChange,

    selection,
    selectionState,
    onToggleSelectAll,
    onToggleSelect,
  } = useModalResultList();

  const {
    itemList: projectItemList,
    itemCount: projectItemCount,
    isLoading: projectIsLoading,
    isFetching: projectIsFetching,

    itemsPerPage: projectPerPage,
    page: projectPage,
    onRowPerPageChange: projectRowChange,
    onPageChange: projectPageChange,
  } = useProjectResultsOverview();

  const headCells = useMemo(
    () => [
      {
        id: 'title',
        label: 'Sample ID',
      },
      {
        id: 'hazard',
        label: 'Hazard',
      },
      {
        id: 'project',
        label: 'Project',
      },
      {
        id: 'action',
        label: 'Go to sample',
      },
    ],
    [],
  );

  const showBarChart = useMemo(() => {
    if (!chartData) {
      return false;
    }

    if (chartData.clientResults.size === 0) {
      return false;
    }

    if (chartData.clientList.size === 0) {
      return false;
    }

    if (chartData.clientResultsColors.size === 0) {
      return false;
    }

    return true;
  }, [chartData]);

  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const handleChangeClientSelection = (newSelection: string[]) => {
    setSelectedClients([...newSelection]);
  };

  return (
    <>
      <Grid container spacing={{ md: 4 }} sx={{ my: 8 }}>
        <Grid item xs={12} sx={{ mb: { xs: 2, lg: 0 } }}>
          <Paper elevation={3}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}
            >
              <Typography variant="h4">
                Total # of samples collected by % of OEL category
              </Typography>
              {showBarChart && (
                <IconButton onClick={() => handleFullScreen(true)}>
                  <FullscreenIcon />
                </IconButton>
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                position: 'relative',
                p: 2,
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  position: 'relative',
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start data"
                    value={startDate}
                    onChange={(newValue) =>
                      newValue && handleStartDate(newValue)
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <Box mx={3} />
                  <DatePicker
                    label="End data"
                    value={endDate}
                    onChange={(newValue) => newValue && handleEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Box>

              <MultiSelect
                clientList={chartData?.clientList}
                onChangeSelection={handleChangeClientSelection}
              />
            </Box>
            <Box sx={{ width: '100%', height: 600 }}>
              {status === RESULT_STATUS.SUCCEEDED && showBarChart && chartData && (
                <>
                  <HorizontalBarChart
                    chartData={chartData}
                    handleOpenModal={handleOpenModal}
                    maxItems={10}
                    selectedClients={selectedClients}
                  />
                </>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={7} sx={{ my: { xs: 2, lg: 0 } }}>
          <Paper elevation={3}>
            <Typography sx={{ p: 2 }} variant="h5">
              Detail of sample scenario selected by % of OEL category
            </Typography>
            <Box sx={{ display: 'flex', py: 2 }}>
              <Box
                sx={{
                  width: '80%',
                  height: 600,
                  display: 'flex',
                  flexFlow: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                }}
              >
                <Autocomplete
                  value={findOption}
                  onOpen={() => toggleOpen(true)}
                  onClose={() => toggleOpen(false)}
                  onChange={(
                    _event,
                    newValue: { label: string; value: string } | null,
                  ) => {
                    setSelectValue(newValue && newValue.value);
                  }}
                  inputValue={inputValue}
                  onInputChange={(_event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  options={formattedHazardList}
                  sx={{ maxWidth: 300, width: '100%' }}
                  renderInput={(params) => (
                    <TextField {...params} label="Hazard" />
                  )}
                />

                <PieChart
                  response={hazardResponse}
                  handleOpenModal={handleOpenModal}
                  hazardId={findOption ? findOption.value : ''}
                />

                <Box sx={{ display: 'flex', position: 'relative', py: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start data"
                      value={pieChartStartDate}
                      onChange={(newValue) =>
                        newValue && pieChartHandleStartDate(newValue)
                      }
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <Box mx={3} />
                    <DatePicker
                      label="End data"
                      value={pieChartEndDate}
                      onChange={(newValue) =>
                        newValue && pieChartHandleEndDate(newValue)
                      }
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexFlow: 'column nowrap',
                  justifyContent: 'space-around',
                  py: 4,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Clients
                  </Typography>
                  <FormGroup>
                    {clientResponse?.map((item) => (
                      <FormControlLabel
                        key={item.id}
                        onChange={() => onToggleSelectClients(item.id)}
                        value={item.id}
                        control={<Checkbox />}
                        label={item.title}
                      />
                    ))}
                    {!clientResponse && (
                      <Typography>
                        Select a sample to filter on clients
                      </Typography>
                    )}
                  </FormGroup>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Sample types
                  </Typography>
                  <FormGroup>
                    {[
                      { id: 'full shift', title: 'Full shift' },
                      { id: 'short term', title: 'Short Term' },
                      { id: 'excursion', title: 'Excursion' },
                      { id: 'grab sample', title: 'Grab sample' },
                    ].map((item) => (
                      <FormControlLabel
                        key={item.id}
                        onChange={() => onToggleSelectSampleType(item.id)}
                        value={item.id}
                        control={<Checkbox />}
                        label={item.title}
                      />
                    ))}
                  </FormGroup>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
          lg={5}
          sx={{
            my: { sx: 2, lg: 0 },
          }}
        >
          <CrudTable
            title="Project Overview"
            headCells={[
              { id: 'total-results', label: 'Results' },
              { id: 'project', label: 'Project' },
            ]}
            itemsPerPage={projectPerPage}
            page={projectPage}
            onRowsPerPageChange={projectRowChange}
            onPageChange={projectPageChange}
            orderBy={orderBy}
            onUpdateOrdering={onUpdateOrdering}
            isLoading={projectIsLoading}
            isFetching={projectIsFetching}
            itemCount={projectItemCount}
            itemList={projectItemList}
            selection={selection}
            selectionState={selectionState}
            onToggleSelectAll={onToggleSelectAll}
            onToggleSelect={onToggleSelect}
            ItemRowComponent={DummyRowItem}
          />
        </Grid>
      </Grid>

      <Modal
        open={isFullscreen}
        onClose={(_event, reason) => {
          if (reason === 'escapeKeyDown') {
            handleFullScreen(false);
          }
          handleFullScreen(false);
        }}
      >
        <Fade in={isFullscreen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              translate: '-50% -50%',
              bgcolor: 'background.paper',
              borderRadius: '5px',
              width: 'calc(100% - 128px)',
              height: 'calc(100% - 128px)',
              overFlow: 'scroll',
              boxShadow: 24,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', position: 'relative' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start data"
                    value={startDate}
                    onChange={(newValue) =>
                      newValue && handleStartDate(newValue)
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <Box mx={3} />
                  <DatePicker
                    label="End data"
                    value={endDate}
                    onChange={(newValue) => newValue && handleEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Box>
              <IconButton onClick={() => handleFullScreen(false)}>
                <FullscreenExitIcon />
              </IconButton>
            </Box>
            <Box sx={{ width: '100%', height: 1000 }}>
              {status === RESULT_STATUS.SUCCEEDED &&
                chartData &&
                showBarChart && (
                  <HorizontalBarChart
                    chartData={chartData}
                    handleOpenModal={handleOpenModal}
                  />
                )}
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="results-modal"
        aria-describedby="results-modal-per-category"
        open={modalState}
        onClose={(_event, reason) => {
          if (reason === 'escapeKeyDown') {
            toggleModal(false);
          }
          toggleModal(false);
        }}
        closeAfterTransition
        sx={{ outline: 'none' }}
      >
        <Fade in={modalState}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              translate: '-50% -50%',
              bgcolor: 'background.paper',
              borderRadius: '5px',
              width: '75%',
              boxShadow: 24,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxHeight: '80vh',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Box sx={{ mb: 2 }}>
                <CrudListPageToolbar
                  showAddButton={false}
                  title="Samples"
                  addLabel=""
                  searchFieldPlaceholder="Search for samples"
                  searchValue={search}
                  onSearchChange={onSearchChange}
                  onAddClick={() => void [0]}
                />
              </Box>
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
                ItemRowComponent={ResultTableItemRow}
              />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
