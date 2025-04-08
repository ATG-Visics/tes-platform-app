import { defaultDecorators } from '@tes/storybook';
import { Meta, Story } from '@storybook/react';
import { RecentList, RecentListProps } from '../ui';
import ProjectsFixture from '../stories/fixtures/projects.fixtures';
import ClientFixture from '../stories/fixtures/clients.fixtures';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends RecentListProps {
  // insert addition story prop types here
}

export default {
  title: 'TES / Dashboard / Recent lists',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

const RecentListTemplate: Story<IProps> = (args) => {
  return <RecentList {...args} />;
};

export const RecentProjects = RecentListTemplate.bind({});

RecentProjects.args = {
  type: 'projects',
  recentList: ProjectsFixture as RecentListProps['recentList'],
};

export const RecentClients = RecentListTemplate.bind({});

RecentClients.args = {
  type: 'clients',
  recentList: ClientFixture as RecentListProps['recentList'],
};

export const RecentEmptyList = RecentListTemplate.bind({});

RecentEmptyList.args = {
  type: 'projects',
  recentList: [],
};
