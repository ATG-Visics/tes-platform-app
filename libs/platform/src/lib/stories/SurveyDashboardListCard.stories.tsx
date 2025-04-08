import { defaultDecorators } from '@tes/storybook';
import { Meta, Story } from '@storybook/react';
import { SurveyDashboardListCard, SurveyDashboardListCardProps } from '../ui';
import EmployeesFixtures from './fixtures/employees.fixtures';
import SamplesFixtures from './fixtures/samples.fixtures';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends SurveyDashboardListCardProps {
  // insert addition story prop types here
}

export default {
  title: 'TES / Survey Dashboard / List Card',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

const SurveyDashboardListCardTemplate: Story<IProps> = (args) => {
  return <SurveyDashboardListCard {...args} />;
};

export const Employees = SurveyDashboardListCardTemplate.bind({});

Employees.args = {
  title: 'Employees',
  buttonText: 'Add employee',
  emptyMessage: 'No employees found',
  itemList: EmployeesFixtures as SurveyDashboardListCardProps['itemList'],
};

export const EmptyEmployees = SurveyDashboardListCardTemplate.bind({});

EmptyEmployees.args = {
  title: 'Employees',
  buttonText: 'Add employee',
  emptyMessage: 'No employees found',
  itemList: [],
};

export const AreaSamples = SurveyDashboardListCardTemplate.bind({});

AreaSamples.args = {
  title: 'Area samples',
  buttonText: 'Add area sample',
  emptyMessage: 'No area samples found',
  itemList: SamplesFixtures as SurveyDashboardListCardProps['itemList'],
};

export const EmptyAreaSamples = SurveyDashboardListCardTemplate.bind({});

EmptyAreaSamples.args = {
  title: 'Area samples',
  buttonText: 'Add area sample',
  emptyMessage: 'No area samples found',
  itemList: [],
};
