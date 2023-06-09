/* eslint-disable @typescript-eslint/no-var-requires */
const withHtml = require('@blunck/next-html')()
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
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  compiler: {
    // Remove console outputs in production builds, see https://nextjs.org/docs/advanced-features/compiler#remove-console
    removeConsole: process.env.ENVIRONMENT_ID === 'production',
  },
}

const sentryWebpackPluginOptions = {
  // Configuration for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

const sentryOptions = {
  // Additional config options for sentry
  hideSourceMaps: true,
}

module.exports = withSentryConfig(
  withTranspileModules(
    [
      'react-native',
      'react-native-reanimated',
      'react-native-card-stack-swiper',
      'react-native-gesture-handler',
      'react-native-webview',
      'react-native-render-html',
      'react-native-animated-pagination-dot',
      'expo-modules-core',
      'expo-camera',
      'expo-constants',
      'expo-status-bar',
      '@jsamr/react-native-li',
      '@holi-apps/donations',
      '@holi-apps/goodnews',
      '@holi-apps/volunteering',
      '@holi/ui',
      '@holi/core',
      '@holi/api',
    ],
    {
      resolveSymlinks: true,
    }
  )(withHtml(nextConfig)),
  sentryWebpackPluginOptions,
  sentryOptions
)
