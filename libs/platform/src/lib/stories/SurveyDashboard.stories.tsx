import { defaultDecorators } from '@tes/storybook';
import { Meta } from '@storybook/react';
import { Box, Container, Typography } from '@mui/material';
import { AreaSampleSubjects as AreaSampleSubjectsStory } from '../stories/AreaSampleSubjectListPage.stories';
import { Calendar as CalendarStory } from '../stories/SurveyDashboardCalendar.stories';
import { Weather as WeatherCardStory } from '../stories/WeatherCard.stories';
import { Log as LogCardStory } from '../stories/LogCard.stories';

export default {
  title: 'TES / Survey Dashboard',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

export function SurveyDashboard() {
  return (
    <Container sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      <CalendarStory {...CalendarStory.args} />
      <Box
        sx={{
          width: 'calc(55% - 16px)',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" mb={2}>
            Survey Dashboard
          </Typography>

          <Typography variant="body1">
            Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu,
            consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in,
            viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus
            varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies
            nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui.
          </Typography>
        </Box>

        <AreaSampleSubjectsStory {...AreaSampleSubjectsStory.args} />
      </Box>
      <Box
        sx={{
          width: 'calc(45% - 16px)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          height: 'auto',
          alignContent: 'flex-start',
        }}
      >
        <LogCardStory {...LogCardStory.args} />

        <WeatherCardStory {...WeatherCardStory.args} />
      </Box>
    </Container>
  );
}
