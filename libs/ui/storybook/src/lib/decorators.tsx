import { Story } from '@storybook/react';
import { MuiApp } from '@tes/ui/app';

export const defaultDecorators = [
  (Story: Story) => (
    <MuiApp>
      <Story />
    </MuiApp>
  ),
];
