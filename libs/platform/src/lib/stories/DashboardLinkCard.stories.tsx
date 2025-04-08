import { defaultDecorators } from '@tes/storybook';
import { Meta, Story } from '@storybook/react';
import {
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Report as ReportIcon,
} from '@mui/icons-material';
import { DashboardLinkCard, DashboardLinkCardProps } from '../ui';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends DashboardLinkCardProps {
  // insert addition story prop types here
}

export default {
  title: 'TES / Dashboard / Dashboard link card',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

const DashboardLinkCardTemplate: Story<IProps> = (args) => {
  return <DashboardLinkCard {...args} />;
};

export const ClientsDashboardLinkCard = DashboardLinkCardTemplate.bind({});

ClientsDashboardLinkCard.args = {
  icon: <PeopleIcon color={'primary'} sx={{ fontSize: '40px' }} />,
  counter: 12,
  title: 'Clients',
  url: '#',
};

export const CompletedFormsDashboardLinkCard = DashboardLinkCardTemplate.bind(
  {},
);

CompletedFormsDashboardLinkCard.args = {
  icon: <AssignmentTurnedInIcon color={'primary'} sx={{ fontSize: '40px' }} />,
  counter: 32,
  title: 'Completed forms',
  url: '#',
};

export const ProjectsDashboardLinkCard = DashboardLinkCardTemplate.bind({});

ProjectsDashboardLinkCard.args = {
  icon: <AssignmentIcon color={'primary'} sx={{ fontSize: '40px' }} />,
  counter: 2,
  title: 'Projects',
  url: '#',
};

export const IssuesDashboardLinkCard = DashboardLinkCardTemplate.bind({});

IssuesDashboardLinkCard.args = {
  icon: <ReportIcon color={'primary'} sx={{ fontSize: '40px' }} />,
  counter: 0,
  title: 'Issues',
  url: '#',
};
