/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct 'react-native' imports to 'react-native-web'
      'react-native$': 'react-native-web',
      'react-native-svg': 'react-native-svg-web',
    }
    config.resolve.extensions = ['.web.js', '.web.ts', '.web.tsx', ...config.resolve.extensions]
    return config
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles'), path.join(__dirname, 'shared/data')],
  },
  experimental: {
    outputStandalone: true,
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  publicRuntimeConfig: {
    kratos: {
      url: process.env.KRATOS_BASE_URL || 'http://localhost:4000/.ory',
    },
  },
}

module.exports = withPlugins(
  [
    withTM(
      [
        'react-native-reanimated',
        'react-native-card-stack-swiper',
        '@holi-apps/community',
        '@holi/ui',
        '@holi/core',
        '@holi/api',
      ],
      {
        resolveSymlinks: true,
        debug: true,
      }
    ),
  ],
  nextConfig
)
