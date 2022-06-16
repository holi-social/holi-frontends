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
    return config
  },
}
