import { defaultDecorators } from '@tes/storybook';
import { Meta, Story } from '@storybook/react';
import { LogCard, LogCardProps } from '../ui';
import LogFixtures from './fixtures/logs.fixtures';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends LogCardProps {
  // insert addition story prop types here
}

export default {
  title: 'TES / Survey Dashboard / Log Card',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

const LogCardTemplate: Story<IProps> = (args) => {
  return <LogCard {...args} />;
};

export const Log = LogCardTemplate.bind({});

Log.args = {
  logMessages: LogFixtures as LogCardProps['logMessages'],
};

export const EmptyLog = LogCardTemplate.bind({});

EmptyLog.args = {
  logMessages: [],
};
