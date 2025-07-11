import type { StorybookConfig } from '@storybook/react-webpack5'
import { dirname, join } from 'path'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

export const stories = [
  '../../components/**/*.mdx',
  '../../patterns/**/*.mdx',
  '../../foundations/**/*.mdx',
  '../../components/**/*.stories.@(js|jsx|ts|tsx)',
  '../../patterns/**/*.stories.@(js|jsx|ts|tsx)',
  '../../foundations/**/*.stories.@(js|jsx|ts|tsx)',
]

const config: StorybookConfig = {
  stories,

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-react-native-web'),
    getAbsolutePath('@storybook/addon-webpack5-compiler-babel'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {},
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
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        'next/image': require.resolve('./nextImageMock.jsx'),
        './image/Image.tsx': './image/Image.web.tsx',
        'react-native-svg': 'react-native-svg-web',
      }
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

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')))
}

export default config
