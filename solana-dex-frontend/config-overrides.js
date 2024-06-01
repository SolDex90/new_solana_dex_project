const webpack = require('webpack');

module.exports = function override(config) {
  // Add fallback for node core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    zlib: require.resolve('browserify-zlib'),
    url: require.resolve('url/'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    vm: require.resolve('vm-browserify'),
    os: require.resolve('os-browserify/browser'),
    path: require.resolve('path-browserify'),  // Add fallback for 'path'
    fs: false,  // Disable fs module for browser
  };

  // Provide global variables
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  // Ignore source map warnings
  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
};
