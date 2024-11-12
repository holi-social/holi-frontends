import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

/** @type{import('@storybook/react-webpack5').StorybookConfig} */
module.exports = {
  stories: ['../components/**/*.mdx', '../tokens/**/*.mdx', '../components/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    'storybook-dark-mode',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-react-native-web',
    '@storybook/addon-webpack5-compiler-babel',
    '@chromatic-com/storybook',
    '@storybook/addon-a11y',
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  features: {
    backgroundsStoryGlobals: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpackFinal: async (config: any) => {
    if (config.resolve) {
      config.resolve.plugins = [
        ...(config.resolve.plugins || []),
        new TsconfigPathsPlugin({
          extensions: config.resolve.extensions,
        }),
      ]
    }

    const fileTypesWithOverrides = ['txt']
    const excludeRegex = new RegExp(`\\.(${fileTypesWithOverrides.join('|')})$`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config?.module?.rules?.forEach((rule: any) => {
      if (!rule || typeof rule !== 'object') return
      if (rule.test instanceof RegExp && fileTypesWithOverrides.some((ending) => rule.test.test(`.${ending}`))) {
        rule.exclude = excludeRegex
      }
    })
    config?.module?.rules?.push({
      test: /\.txt$/,
      type: 'asset/source',
    })

    return config
  },

  docs: {},
}
