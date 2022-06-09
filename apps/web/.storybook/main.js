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
    '@storybook/addon-knobs',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
}
