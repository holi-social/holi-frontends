/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require('next-compose-plugins')
const withHtml = require('@blunck/next-html')()
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
    output: 'standalone',
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  transpilePackages: [
    'react-native',
    'react-native-web',
    'react-native-reanimated',
    'react-native-render-html',
    'react-native-animated-pagination-dot',
    'react-native-card-stack-swiper',
    'react-native-reanimated-carousel',
    'react-native-gesture-handler',
    '@jsamr/react-native-li',
    '@holi-apps/donations',
    '@holi-apps/goodnews',
    '@holi-apps/volunteering',
    '@holi/ui',
    '@holi/core',
    '@holi/api',
    'expo-status-bar',
  ],
  resolveSymlinks: true,
  debug: true,
  sentry: {
    hideSourceMaps: true, // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
  },
  swcMinify: true,
  compiler: {
    removeConsole: {
      exclude: ['log'],
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
      {
        resolveSymlinks: true,
        debug: true,
      },
    ],
    withHtml(nextConfig)
  ),
  sentryWebpackPluginOptions
)
