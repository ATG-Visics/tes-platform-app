import { useMemo } from 'react';
import { Alert, Box, CircularProgress, Stack } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useGetSamplingPlanChartDataQuery } from '../../api';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useGetAllSurveyMomentsQuery } from '@tes/survey';

interface DataEntry {
  date: string;
  count: number;
}

interface TimeSeriesData {
  labels: string[];
  values: (number | null)[];
}

type TimePeriod = 'day' | 'week' | 'month';

function generateTimeSeriesData(
  data: DataEntry[],
  period: TimePeriod,
): TimeSeriesData {
  if (data.length === 0) return { labels: [], values: [] };

  const startDate = new Date(data[0].date);
  const endDate = new Date(data[data.length - 1].date);

  const labels: string[] = [];
  const values: (number | null)[] = [];
  const currentDate = new Date(startDate);

  let lastKnownValue: number | null = null;

  while (currentDate <= endDate) {
    let label: string;
    switch (period) {
      case 'day':
        label = currentDate.toISOString().split('T')[0];
        break;
      case 'week':
        label = `W${getWeekNumber(currentDate)}`;
        break;
      case 'month':
        label = currentDate
          .toLocaleString('en-US', { month: 'short' })
          .toUpperCase();
        break;
    }
    labels.push(label);

    const matchingEntry = data.find((entry) =>
      isInSamePeriod(new Date(entry.date), currentDate, period),
    );

    if (matchingEntry) {
      lastKnownValue = matchingEntry.count;
    }

    values.push(lastKnownValue);

    switch (period) {
      case 'day':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'week':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'month':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
  }

  return { labels, values };
}

function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function isInSamePeriod(date1: Date, date2: Date, period: TimePeriod): boolean {
  switch (period) {
    case 'day':
      return (
        date1.toISOString().split('T')[0] === date2.toISOString().split('T')[0]
      );
    case 'week':
      return (
        getWeekNumber(date1) === getWeekNumber(date2) &&
        date1.getFullYear() === date2.getFullYear()
      );
    case 'month':
      return (
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
      );
  }
}

export function SamplingPlanChartPage() {
  const { id = '' } = useParams();
  const { data, isLoading, isError } = useGetSamplingPlanChartDataQuery(id);
  const { data: surveyData } = useGetAllSurveyMomentsQuery({
    project: id,
    limit: 1000,
  });
  const {
    countsByMonth = [],
    targetSampleCount = 0,
    currentSampleCount = 0,
  } = data || {};

  const { labels, values } = useMemo(
    () => generateTimeSeriesData(countsByMonth, 'month'),
    [countsByMonth],
  );

  const firstDate = useMemo(
    () =>
      surveyData &&
      surveyData.results.length > 0 &&
      surveyData.results[surveyData.results.length - 1].startDate,
    [surveyData],
  );

  return (
    <>
      {isLoading && <CircularProgress />}

      {isError && (
        <Box>
          <Alert severity="error">
            There is an error with getting the date
          </Alert>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginTop: 2,
        }}
      >
        <Stack>
          <Box>
            <strong>First survey date</strong>
          </Box>
          <Box>
            {firstDate ? dayjs(firstDate).format('MMMM DD, YYYY') : '---'}
          </Box>
        </Stack>
        <Stack>
          <Box>
            <strong>Samples taken</strong>
          </Box>
          <Box>
            {currentSampleCount} / {targetSampleCount}
          </Box>
        </Stack>
      </Box>
      <LineChart
        width={550}
        height={250}
        series={[
          {
            data: values,
            label: 'Samples to take',
            area: true,
            showMark: false,
            stack: 'total',
            connectNulls: true,
            color: '#75A4A3',
            curve: 'stepAfter',
          },
        ]}
        xAxis={[
          {
            scaleType: 'point',
            data: labels,
          },
        ]}
        slotProps={{
          legend: { hidden: true },
        }}
        sx={{
          marginTop: -4,
          '& .MuiLineElement-root': {
            strokeWidth: 3,
          },
          '& .MuiAreaElement-root': {
            fill: '#75A4A3',
            opacity: 0.2,
          },
        }}
      />
    </>
  );
}
