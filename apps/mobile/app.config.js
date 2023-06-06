// see https://docs.expo.dev/build-reference/app-versions/
// TODO somehow automatically increment version numbers on every release
const versions = {
  version: '1.1.0', // user-facing value visible in stores
  iosBuildNumber: '1.1.0', // developer-facing build version, see https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion
  androidVersionCode: 16, // developer-facing build version, see https://developer.android.com/studio/publish/versioning.html#versioningsettings
}

export default {
  expo: {
    name: 'holi',
    slug: 'projectholi',
    owner: 'holistic-foundation',
    version: versions.version,
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'holi',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#F5F5F5',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'social.holi',
      buildNumber: versions.iosBuildNumber,
      config: {
        // usesNonExemptEncryption see https://docs.expo.dev/versions/latest/config/app/#usesnonexemptencryption
        // and https://help.apple.com/app-store-connect/#/devc3f64248f
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        CFBundleAllowMixedLocalizations: true,
        LSApplicationQueriesSchemes: ['itms-apps', 'itms-beta'],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#F5F5F5',
      },
      package: 'foundation.holistic.projectholi',
      versionCode: versions.androidVersionCode,
    },
    plugins: [
      'sentry-expo',
      [
        'expo-image-picker',
        {
          photosPermission: 'Allow access to photos to upload a picture of you to your profile.',
        },
      ],
    ],
    hooks: {
      postPublish: [
        {
          file: 'sentry-expo/upload-sourcemaps',
          config: {
            organization: 'holistic-foundation',
            project: 'holi-app-mobile',
            authToken: process.env.SENTRY_AUTH_TOKEN,
          },
        },
      ],
    },
    extra: {
      chat: {
        homeserverUrlKey: process.env.MX_HS_KEY || 'mx_sso_hs_url',
        homeserverName: process.env.MX_HS_NAME || 'local.chat.holi.social/',
        homeserverUrl: process.env.MX_HS_URL || 'https://local.chat.holi.social/',
        identityServerUrl: process.env.MX_IS_URL || 'https://vector.im',
      },
      ory: {
        url: process.env.ORY_BASE_URL || 'https://dev-auth.holi.social',
      },
      holi_api: {
        url: process.env.HOLI_API_URL || 'http://10.0.2.2:4001/graphql',
      },
      environment: process.env.ENVIRONMENT_ID || 'development',
      sentry: {
        dsn: process.env.SENTRY_DSN || 'https://0e50481f84454f9a838a8217085498f0@o949544.ingest.sentry.io/6377191',
      },
      owncloud: {
        url: process.env.OWNCLOUD_BASE_URL || 'https://development.cloud.holi.social',
      },
      eas: {
        projectId: process.env.EXPO_PROJECT_ID,
      },
      e2e: {
        userId: process.env.E2E_USER_ID || '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0',
      },
    },
  },
}
