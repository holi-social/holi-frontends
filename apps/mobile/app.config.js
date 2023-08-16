// see https://docs.expo.dev/build-reference/app-versions/
// TODO somehow automatically increment version numbers on every release
const versions = {
  version: '1.5.1', // user-facing value visible in stores
  iosBuildNumber: '1.5.1', // developer-facing build version, see https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion
  androidVersionCode: 23, // developer-facing build version, see https://developer.android.com/studio/publish/versioning.html#versioningsettings
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
        UIBackgroundModes: [
          'remote-notification', // enables the app to receive push notifications while app is in background
        ],
      },
      // TODO add googleServicesFile for iOS
    },
    android: {
      package: 'social.holi.app',
      versionCode: versions.androidVersionCode,
      // used for FCM push notifications, see https://docs.expo.dev/push-notifications/push-notifications-setup/#android
      googleServicesFile: './google-services.json',
    },
    plugins: [
      ['sentry-expo'],
      [
        'expo-image-picker',
        {
          photosPermission: 'Allow access to photos to upload a picture of you to your profile.',
        },
      ],
      [
        'expo-camera',
        {
          cameraPermission: 'Allow access to your camera for video calls',
          microphonePermission: 'Allow access to your microphone for video calls',
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
          },
        },
      ],
    },
    extra: {
      chat: {
        serverName: process.env.HOLI_CHAT_SERVER_NAME || 'staging.chat.holi.social',
        serverLoginUrl: process.env.HOLI_API_GATEWAY + '/api/chatlogin',
        serverUrl: process.env.HOLI_CHAT_SERVER_URL || 'https://staging.chat.holi.social/',
        identityServerUrl: process.env.HOLI_CHAT_IDENTITY_SERVER_URL || 'https://vector.im',
        pushGatewayUrl: process.env.HOLI_CHAT_PUSH_GATEWAY_URL || 'https://staging-push.chat.holi.social',
      },
      ory: {
        url: process.env.ORY_BASE_URL || 'https://dev-auth.holi.social',
      },
      holi_api: {
        url: process.env.HOLI_API_URL || 'http://10.0.2.2:4001/graphql',
        gateway: process.env.HOLI_API_GATEWAY || 'http://10.0.2.2:4001',
      },
      holi_nextjs_api: {
        url: process.env.HOLI_NEXTJS_API_URL || 'http://localhost:3000',
      },
      environment: process.env.ENVIRONMENT_ID || 'development',
      sentry: {
        dsn: process.env.SENTRY_DSN || 'https://0e50481f84454f9a838a8217085498f0@o949544.ingest.sentry.io/6377191',
      },
      owncloud: {
        url: process.env.OWNCLOUD_BASE_URL || 'https://development.cloud.holi.social',
      },
      jitsi: {
        url: process.env.JITSI_URL || 'https://development.meet.holi.social',
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
