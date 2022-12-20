const webpack = require('webpack')
const path = require('path')

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
    {
      name: '@storybook/addon-react-native-web',
      options: {
        modulesToTranspile: ['react-native-reanimated'],
        babelPlugins: ['react-native-reanimated/plugin'],
      },
    },
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config) => {
    config.module.rules.push(
      {
        test: /\.s(a|c)ss$/,
        include: path.resolve(__dirname, '../../../'),
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
          'sass-loader'
        ],
      },
    );
    return config;
  },
}
