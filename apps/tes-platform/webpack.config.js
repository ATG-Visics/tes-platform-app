const getWebpackConfig = require('@nrwl/react/plugins/webpack');

module.exports = function (config, context) {
  const { mainFields = [] } = config.resolve;
  mainFields.splice(mainFields.indexOf('module'), 1);

  config.resolve.mainFields = mainFields;

  return getWebpackConfig(config);
};
