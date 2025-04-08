import { defaultDecorators } from '@tes/storybook';
import { Meta, Story } from '@storybook/react';
import { Calendar as CalendarComponent, CalendarProps } from '../ui';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends CalendarProps {
  // insert addition story prop types here
}

export default {
  title: 'TES / Dashboard / Calendar',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

const CalendarTemplate: Story<IProps> = (args) => {
  return <CalendarComponent {...args} />;
};

export const CalendarCurrentDate = CalendarTemplate.bind({});

CalendarCurrentDate.args = {
  currentDate: new Date(Date.now()),
};

export const CalendarStaticDate = CalendarTemplate.bind({});

CalendarStaticDate.args = {
  currentDate: new Date('2023-05-28'),
};
