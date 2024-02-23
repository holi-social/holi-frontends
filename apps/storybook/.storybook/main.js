import { dirname, join } from 'path'

const path = require('path')
const uiPackageDir = '../../../packages/ui'
const iconsPackageDir = '../../../packages/icons'
module.exports = {
  staticDirs: ['../../web/public'],

  stories: [
    `${uiPackageDir}/**/__stories__/**/*.stories.mdx`,
    `${uiPackageDir}/**/__stories__/**/*.stories.@(js|jsx|ts|tsx)`,
    `${iconsPackageDir}/**/__stories__/**/*.stories.mdx`,
    `${iconsPackageDir}/**/__stories__/**/*.stories.@(js|jsx|ts|tsx)`,
    /*
     * Object path declarations
     */
    {
      directory: uiPackageDir,
      files: '*.stories.*',
    },
    '../../../holi-apps/donations/**/__stories__/*.stories.mdx',
    '../../../holi-apps/donations/**/__stories__/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-storysource'),
    {
      name: '@storybook/addon-react-native-web',
      options: {
        modulesToTranspile: ['react-native-reanimated'],
        babelPlugins: ['react-native-reanimated/plugin'],
      },
    },
  ],

  framework: {
    name: getAbsolutePath('@storybook/nextjs'),
    options: {},
  },

  webpackFinal: async (config) => {
    config?.module?.rules?.forEach((rule) => {
      if (!rule || typeof rule !== 'object') return
      if (rule.test instanceof RegExp && (rule.test.test('.svg') || rule.test.test('.png'))) {
        rule.exclude = /\.(svg|png)$/
      }
    })
    config?.module?.rules?.push({
      test: /\.(svg|png)$/,
      type: 'asset/resource',
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
