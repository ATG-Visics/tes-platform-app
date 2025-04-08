import { defaultDecorators } from '@tes/storybook';
import { Meta, Story } from '@storybook/react';
import { WeatherCard, WeatherCardProps } from '../ui';
import WeatherFixtures from './fixtures/weather.fixtures';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends WeatherCardProps {
  // insert addition story prop types here
}

export default {
  title: 'TES / Survey Dashboard / Weather Card',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

const WeatherCardTemplate: Story<IProps> = (args) => {
  return <WeatherCard {...args} />;
};

export const Weather = WeatherCardTemplate.bind({});

Weather.args = {
  title: 'Weather conditions',
  emptyMessage: 'No weather conditions found',
  weatherConditions: WeatherFixtures as WeatherCardProps['weatherConditions'],
};

export const EmptyWeather = WeatherCardTemplate.bind({});

EmptyWeather.args = {
  title: 'Weather conditions',
  emptyMessage: 'No weather conditions found',
  weatherConditions: [],
};
