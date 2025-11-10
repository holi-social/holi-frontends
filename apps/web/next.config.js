/* eslint-disable @typescript-eslint/no-var-requires */
const withHtml = require('@blunck/next-html')()
const path = require('path')
const { withSentryConfig } = require('@sentry/nextjs')
const { withExpo } = require('@expo/next-adapter')
const { locales } = require('../../core/i18n/locales.cjs')
const webpack = require('webpack')

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'dev-images.holi.social',
      },
      {
        protocol: 'https',
        hostname: 'images.holi.social',
      },
      {
        protocol: 'https',
        hostname: 'gemeinschaftswerk-nachhaltigkeit.de',
      },
    ],
  },
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct 'react-native' imports to 'react-native-web'
      'react-native$': 'react-native-web',
      'react-native-svg': 'react-native-svg-web',
    }
    config.resolve.extensions = ['.web.js', '.web.ts', '.web.tsx', '.web.jsx', ...config.resolve.extensions]
    // Global __DEV__ only set by react-native on mobile
    config.plugins.push(new webpack.DefinePlugin({ __DEV__: process.env.NODE_ENV !== 'production' }))
    config.module.rules.push({
      test: /\.[jt]sx?$/,
      include: /node_modules\/(expo|expo-modules-core)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel', '@babel/preset-typescript'],
          plugins: ['react-native-reanimated/plugin'],
        },
      },
    })
    return config
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles'), path.join(__dirname, 'shared/data')],
  },
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    instrumentationHook: true,
  },
  i18n: {
    // Adding a "default" locale as Next.js does not distinguish between explicitly specifying the default locale and not specifying a locale at all (i.e. /default/spaces === /spaces) and would either not allow explicitly overriding the locale with the default ("en") or result in an endless redirect loop
    locales: ['default'].concat(locales),
    defaultLocale: 'default',
    localeDetection: false,
  },
  redirects: async () => [
    {
      source: '/apps/donations',
      destination: '/donations',
      permanent: true,
    },
    {
      source: '/apps/donations/project/:projectId*',
      destination: '/donations/:projectId*',
      permanent: true,
    },
    {
      source: '/apps/volunteering',
      destination: '/volunteering',
      permanent: true,
    },
    {
      source: '/apps/volunteering/engagement/:engagementId*',
      destination: '/volunteering/:engagementId*',
      permanent: true,
    },
  ],
  rewrites: async () => [
    // Required for .txt ending
    {
      source: '/robots.txt',
      destination: '/api/robots',
    },
    // Required for combination of dynamic page parameters and .xml ending
    {
      source: '/sitemap/insights/:page.xml',
      destination: '/sitemap/insights/:page',
    },
    // Locale specific route variants
    {
      source: '/spenden',
      destination: '/donations',
    },
    {
      source: '/spenden/:projectId*',
      destination: '/donations/:projectId*',
    },
    {
      source: '/ehrenamt',
      destination: '/volunteering',
    },
    {
      source: '/ehrenamt/:engagementId*',
      destination: '/volunteering/:engagementId*',
    },
    {
      source: '/spaces/:spaceIdOrName/aufgaben',
      destination: '/spaces/:spaceIdOrName/tasks',
    },
    {
      source: '/spaces/:spaceIdOrName/aufgaben/:taskId*',
      destination: '/spaces/:spaceIdOrName/tasks/:taskId*',
    },
  ],
  compiler: {
    // Remove console outputs in production builds, see https://nextjs.org/docs/advanced-features/compiler#remove-console
    removeConsole: process.env.ENVIRONMENT_ID === 'production',
  },
  transpilePackages: [
    'react-native',
    'react-native-animated-pagination-dot',
    'react-native-calendars',
    'react-native-card-stack-swiper',
    'react-native-gesture-handler',
    'react-native-reanimated',
    'react-native-reanimated-carousel',
    'react-native-render-html',
    'react-native-safe-area-context',
    'react-native-svg',
    'react-native-swipe-gestures',
    'react-native-media-query',
    'react-native-unistyles',
    'react-native-web',
    'react-native-webview',
    'react-native-worklets',
    '@react-native-clipboard/clipboard',
    'recyclerlistview',
    'expo',
    'expo-modules-core',
    'expo-camera',
    'expo-constants',
    'expo-device',
    'expo-linking',
    'expo-image-manipulator',
    'expo-notifications',
    'react-native-keyboard-controller',
    'expo-status-bar',
    '@jsamr/react-native-li',
    '@holi-apps/donations',
    '@holi-apps/goodnews',
    '@holi-apps/volunteering',
    '@holi-apps/events',
    '@holi/ui',
    '@holi/icons',
    '@holi/core',
    '@holi/api',
    '@holi/chat',
    '@shopify/flash-list',
  ],
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

module.exports = withExpo(withSentryConfig(withHtml(nextConfig), sentryWebpackPluginOptions, sentryOptions))
