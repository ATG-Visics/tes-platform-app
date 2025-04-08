import { defaultDecorators } from '@tes/storybook';
import { Meta, Story } from '@storybook/react';
import { SampleDetailProps, SampleDetail } from '../ui';

function getDate() {
  const today = new Date();
  today.setHours(8, 39, 24);
  return today;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends SampleDetailProps {
  // insert addition story prop types here
}

export default {
  title: 'TES / Sample / Sample detail',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

const SampleDetailTemplate: Story<IProps> = (args) => {
  return <SampleDetail {...args} />;
};

export const SampleDetailView = SampleDetailTemplate.bind({});

SampleDetailView.args = {
  sampleType: 'Personal sample',
  title: '#CCC8222-03',
  subtitle: 'Matthijs Bøkmann',
  instrument: 'Casella D Badge',
  instrumentSerial: '#1167113',
  sampleMedia: 'Datalog',
  calibrator: 'ACOUNSTIC CALIBRATOR 5230727',
  hazards: [
    'Methane',
    'Sulfur Dioxide',
    'Sulfuric Acid',
    'Selenium',
    'Antimony',
  ],
  status: 'Running',
  startTime: getDate(),
  lastCheck: new Date(),
  initialFlowRate: '10 L/m',
  method: '???',
  twa: 'Assume same',
};
