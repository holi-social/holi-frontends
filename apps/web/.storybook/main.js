const webpack = require('webpack')

module.exports = {
  features: {
    interactionsDebugger: true,
  },
  stories: [
    /*
     * Inline path declarations
     */
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
    /*
     * Object path declarations
     */
    {
      directory: '../stories',
      files: '*.stories.*',
    },
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-storysource',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: (config) => {
    config.resolve.alias = {
      'react-native$': 'react-native-web',
    }

    // https://github.com/react-native-svg/react-native-svg/issues/1553#issuecomment-1011487502
    config.resolve.extensions.unshift('.web.js')

    // Configuration needed for react-native-reanimated
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: 'true',
      })
    )
    // Configuration needed for react-native-reanimated (https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/web-support/)
    config.module.rules.push({
      test: /\.(js|jsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', { plugins: ['@babel/plugin-proposal-class-properties'] }],
        },
      },
    })

    return config
  },
}
