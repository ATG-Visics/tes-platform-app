import { defaultDecorators } from '@tes/storybook';
import { Meta, Story } from '@storybook/react';
import { SurveyDashboardCalendar, SurveyDashboardCalendarProps } from '../ui';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends SurveyDashboardCalendarProps {
  // insert addition story prop types here
}

export default {
  title: 'TES / Survey Dashboard',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

const SurveyDashboardCalendarTemplate: Story<IProps> = (args) => {
  return <SurveyDashboardCalendar {...args} />;
};

export const Calendar = SurveyDashboardCalendarTemplate.bind({});

Calendar.args = {
  startDate: new Date('2023-01-01'),
  endDate: new Date('2023-02-14'),
};
