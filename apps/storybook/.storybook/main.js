const webpack = require('webpack')

const storiesDirectory = '../../../packages/ui/components'

module.exports = {
  staticDirs: ['../../web/public'],
  features: {
    interactionsDebugger: true,
  },
  stories: [
    /*
     * Inline path declarations
     */
    `${storiesDirectory}/**/__stories__/**/*.stories.mdx`,
    `${storiesDirectory}/**/__stories__/**/*.stories.@(js|jsx|ts|tsx)`,
    /*
     * Object path declarations
     */
    {
      directory: storiesDirectory,
      files: '*.stories.*',
    },
    '../../../holi-apps/donations/**/__stories__/*.stories.mdx',
    '../../../holi-apps/donations/**/__stories__/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-storysource',
    'storybook-react-i18next',
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
