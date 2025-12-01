import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import type { StorybookConfig } from '@storybook/react-webpack5'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
// eslint-disable-next-line no-restricted-imports
import { stories } from '../stories.ts'

const require = createRequire(import.meta.url)

const config: StorybookConfig = {
  stories,
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-react-native-web'),
    getAbsolutePath('@storybook/addon-webpack5-compiler-babel'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
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

      config.resolve.fallback = {
        ...config.resolve.fallback,
        console: false,
        tty: require.resolve('tty-browserify'),
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

function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

export default config
