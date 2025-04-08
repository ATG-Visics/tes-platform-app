import { defaultDecorators } from '@tes/storybook';
import { Meta, Story } from '@storybook/react';
import { FullWidthListCard, FullWidthListCardProps } from '../ui';
import ProjectsFixture from '../stories/fixtures/projects.fixtures';
import { FallbackListItem } from '../ui';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps<T> extends FullWidthListCardProps<T> {
  // insert addition story prop types here
}

export default {
  title: 'TES / Client / Full width list card',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

const FullWidthListCardTemplate: Story<IProps<{ id: string | number }>> = (
  args,
) => {
  return <FullWidthListCard {...args} />;
};

export const ListWithItems = FullWidthListCardTemplate.bind({});

ListWithItems.args = {
  title: 'Projects',
  emptyMessage: 'No projects have been added yet.',
  buttonText: 'Start new project',
  itemList: ProjectsFixture,
  itemCount: 2,
  ListItemComponent: FallbackListItem,
};

export const EmptyList = FullWidthListCardTemplate.bind({});

EmptyList.args = {
  title: 'Projects',
  emptyMessage: 'No projects have been added yet.',
  buttonText: 'Start new project',
  itemList: [],
};
