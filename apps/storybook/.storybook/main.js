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
}
