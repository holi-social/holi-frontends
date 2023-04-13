/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require('next-compose-plugins')
const withHtml = require('@blunck/next-html')()
const withTranspileModules = require('next-transpile-modules')
const path = require('path')
const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct 'react-native' imports to 'react-native-web'
      'react-native$': 'react-native-web',
      'react-native-svg': 'react-native-svg-web',
    }
    config.resolve.extensions = ['.web.js', '.web.ts', '.web.tsx', ...config.resolve.extensions]
    // Add supports to imported videos
    config.module.rules.push({
      test: /\.mp4$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/media/',
            outputPath: `${isServer ? '../' : ''}static/media/`,
            name: '[name].[hash].[ext]',
          },
        },
      ],
    })
    return config
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles'), path.join(__dirname, 'shared/data')],
  },
  experimental: {
    outputStandalone: true,
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    localeDetection: false,
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
          'react-native-reanimated',
          'react-native-card-stack-swiper',
          'react-native-gesture-handler',
          'react-native-web',
          'react-native-webview',
          'react-native-render-html',
          'react-native-animated-pagination-dot',
          'expo-asset',
          'expo-status-bar',
          'expo-modules-core',
          'expo-av',
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
          debug: true,
        }
      ),
    ],
    withHtml(nextConfig)
  ),
  sentryWebpackPluginOptions
)
