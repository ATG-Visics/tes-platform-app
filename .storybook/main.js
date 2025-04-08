const path = require('path');

const rootDir = path.resolve(__dirname, '../');

module.exports = {
  core: {
    builder: 'webpack5',
    disableTelemetry: true,
  },
  stories: [`${rootDir}/{apps,libs}/**/*.stories.@(ts|tsx)`],
  addons: ['@storybook/addon-essentials', '@nrwl/react/plugins/storybook'],
  typescript: { check: false, reactDocgen: false },
  features: {
    storyStoreV7: true,
    postcss: false,
  },
  // uncomment the property below if you want to apply some webpack config globally
  // webpackFinal: async (config, { configType }) => {
  //   // Make whatever fine-grained changes you need that should apply to all storybook configs

  //   // Return the altered config
  //   return config;
  // },
};
