import { dirname, join } from 'path'

const uiPackageDir = '../../../packages/ui'
const iconsPackageDir = '../../../packages/icons'
module.exports = {
  staticDirs: ['../../web/public'],

  stories: [
    `${uiPackageDir}/**/*.stories.@(js|jsx|ts|tsx|mdx)`,
    `${iconsPackageDir}/**/*.stories.@(js|jsx|ts|tsx|mdx)`,
    '../../../holi-apps/donations/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-actions'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-storysource'),
    {
      name: '@storybook/addon-react-native-web',
      options: {
        modulesToTranspile: ['react-native-reanimated'],
        babelPlugins: ['@babel/plugin-proposal-export-namespace-from', 'react-native-reanimated/plugin'],
      },
    },
  ],

  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },

  webpackFinal: async (config) => {
    const fileTypesWithOverrides = ['svg', 'png', 'txt']
    const excludeRegex = new RegExp(`\\.(${fileTypesWithOverrides.join('|')})$`)
    config?.module?.rules?.forEach((rule) => {
      if (!rule || typeof rule !== 'object') return
      if (rule.test instanceof RegExp && fileTypesWithOverrides.some((ending) => rule.test.test(`.${ending}`))) {
        rule.exclude = excludeRegex
      }
    })
    config?.module?.rules?.push({
      test: /\.(svg|png)$/,
      type: 'asset/resource',
    })
    config?.module?.rules?.push({
      test: /\.txt$/,
      type: 'asset/source',
    })
    return config
  },

  typescript: {
    reactDocgen: false,
  },

  docs: {
    autodocs: true,
  },
}

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')))
}
