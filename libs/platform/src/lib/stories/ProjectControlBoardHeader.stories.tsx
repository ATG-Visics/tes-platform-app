import { defaultDecorators } from '@tes/storybook';
import { Meta, Story } from '@storybook/react';
import {
  ProjectControlBoardHeader,
  ProjectControlBoardHeaderProps,
} from '../ui';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends ProjectControlBoardHeaderProps {
  // insert addition story prop types here
}

export default {
  title: 'TES / Project control board / Header',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

const ProjectControlBoardHeaderTemplate: Story<IProps> = (args) => {
  return <ProjectControlBoardHeader {...args} />;
};

export const Header = ProjectControlBoardHeaderTemplate.bind({});

export const projectControlBoardTabs = [
  {
    id: '1',
    title: 'Projectinfo',
  },
  {
    id: '2',
    title: 'Site info',
  },
  {
    id: '3',
    title: 'Survey dashboard',
  },
  {
    id: '4',
    title: 'Lab results',
  },
  {
    id: '5',
    title: 'Summary',
  },
];

Header.args = {
  title: 'Access Technology, The Lab Site',
  subtitle: 'Sound Level Survey',
  projectNumber: '#11-1-1604-22254',
  tabsValue: '2',
  dashboardTabs: projectControlBoardTabs,
};
