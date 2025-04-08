import { Box, Typography } from '@mui/material';
import { CrudTable } from '@tes/crud';
import { useFetchList } from '../../hooks';
import { SurveyCrudTableRow } from '../SurveyCrudTableRow';
import * as colors from '@tes/ui/colors';
import { useCustomNavigate } from '@tes/router';
import dayjs, { Dayjs } from 'dayjs';

interface IProps {
  projectId?: string;
  setSelectedDate: (selectedDate: Dayjs) => void;
}

const headCells = [
  {
    id: 'date',
    label: 'Created at',
  },
  {
    id: 'sampler',
    label: 'Sampler(s)',
  },
  {
    id: 'samplesTaken',
    label: 'Samples created',
  },
  {
    id: 'labResults',
    label: 'Lab results',
  },
  {
    id: 'recentActivity',
    label: 'Recent activity',
  },
  // TODO: Fix link then add header
  // {
  //   id: 'gotoDashboard',
  //   label: 'Goto dashboard',
  // },
];

export function SurveyDays(props: IProps) {
  const { projectId, setSelectedDate } = props;
  const { navigateToRoute } = useCustomNavigate();

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

    orderBy,
    onUpdateOrdering,

    selection,
    selectionState,
    onToggleSelectAll,
    onToggleSelect,
  } = useFetchList(projectId);

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          variant={'h6'}
          sx={{ flexGrow: 1, color: colors.accent1['700'] }}
        >
          Survey days
        </Typography>
      </Box>
      <Box>
        {isSuccess && (
          <CrudTable
            title="Survey days"
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
            ItemRowComponent={SurveyCrudTableRow}
            onRowClick={(item) => {
              setSelectedDate(dayjs(new Date(item.startDate)));
              navigateToRoute('surveyDashboard', {
                params: { id: projectId || '' },
                query: { selectedDate: item.startDate },
              });
            }}
          />
        )}
      </Box>
    </Box>
  );
}
