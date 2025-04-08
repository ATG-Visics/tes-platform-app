import { defaultDecorators } from '@tes/storybook';
import { Meta } from '@storybook/react';
import {
  ClientsDashboardLinkCard as ClientsDashboardLinkCardStory,
  CompletedFormsDashboardLinkCard as CompletedFormsDashboardLinkCardStory,
  ProjectsDashboardLinkCard as ProjectsDashboardLinkCardStory,
  IssuesDashboardLinkCard as IssuesDashboardLinkCardStory,
} from './DashboardLinkCard.stories';
import {
  RecentProjects as RecentProjectStory,
  RecentClients as RecentClientStory,
} from './RecentList.stories';
import { CalendarCurrentDate as CalendarStory } from './Calendar.stories';
import { Box, Container } from '@mui/material';

export default {
  title: 'TES / Dashboard',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

export function Dashboard() {
  return (
    <Container sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Box
        sx={{
          width: 'calc(50% - 8px)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <DashboardLinkCards />
      </Box>
      <Box sx={{ width: 'calc(50% - 8px)' }}>
        <CalendarStory {...CalendarStory.args} />
      </Box>
      <Box
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        <RecentProjectStory {...RecentProjectStory.args} />
        <RecentClientStory {...RecentClientStory.args} />
      </Box>
    </Container>
  );
}

function DashboardLinkCards() {
  return (
    <>
      <ClientsDashboardLinkCardStory {...ClientsDashboardLinkCardStory.args} />
      <CompletedFormsDashboardLinkCardStory
        {...CompletedFormsDashboardLinkCardStory.args}
      />
      <ProjectsDashboardLinkCardStory
        {...ProjectsDashboardLinkCardStory.args}
      />
      <IssuesDashboardLinkCardStory {...IssuesDashboardLinkCardStory.args} />
    </>
  );
}
