import { Box, Container, Grid, Typography } from '@mui/material';
import { PageNotFound } from '@tes/ui/core';
import { SurveyDashboardCalendar } from '@tes/platform';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AreaSampleSubjectListPage } from '@tes/area-sample-subject';
import { MessageLogListPage } from '@tes/message-log';
import { WeatherConditionsListPage } from '@tes/weather-conditions';

interface ContextType {
  selectedDate: Dayjs;
  setSelectedDate: (date: Dayjs) => void;
}

export function SurveyDashboard() {
  const { selectedDate, setSelectedDate } = useOutletContext<ContextType>();

  const { id = '' } = useParams();

  const surveyMoment = useMemo(() => {
    return {
      project: id || '',
      startDate: selectedDate.format('YYYY-MM-DD'),
    };
  }, [selectedDate, id]);

  return (
    <Container sx={{ marginTop: 4 }}>
      {id === null && <PageNotFound />}

      <Grid container spacing={{ xs: 2, md: 3 }} mb={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" mb={2} sx={{ fontWeight: 500 }}>
            {`Survey Dashboard, ${
              selectedDate
                ? dayjs(selectedDate).format('ddd DD MMM YYYY')
                : dayjs().format('ddd DD MMM YYYY')
            }`}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: 'inline-flex', justifyContent: 'flex-end' }}
        >
          <SurveyDashboardCalendar
            startDate={new Date('2023-01-01')}
            value={selectedDate}
            setValue={setSelectedDate}
          />
        </Grid>
      </Grid>

      {/* Area Sample Subject, Message Logs, Weather Conditions */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={6}>
          <AreaSampleSubjectListPage surveyMomentId={surveyMoment} />
        </Grid>
        <Grid item xs={12} md={6}>
          <MessageLogListPage surveyMomentId={surveyMoment} />
          <Box mt={2} mb={2} />
          <WeatherConditionsListPage surveyMoment={surveyMoment} />
        </Grid>
      </Grid>
      <Outlet context={{ surveyMoment }} />
    </Container>
  );
}
