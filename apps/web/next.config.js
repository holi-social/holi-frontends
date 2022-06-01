/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require('next-compose-plugins')
const withTranspileModules = require('next-transpile-modules')
const path = require('path')
const { withSentryConfig } = require('@sentry/nextjs')

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
      url: process.env.KRATOS_BASE_URL || 'https://auth.project-holi.org',
    },
    holi_api: {
      url: process.env.HOLI_API_URL || 'http://localhost:4001/graphql',
    },
  },
}

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

module.exports = withSentryConfig(
  withPlugins(
    [
      withTranspileModules(
        [
          'solito',
          'react-native-reanimated',
          'react-native-card-stack-swiper',
          '@holi-apps/volunteering',
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
  ),
  sentryWebpackPluginOptions
)
