// see https://docs.expo.dev/build-reference/app-versions/
// TODO somehow automatically increment version numbers on every release
const versions = {
  version: '1.5.1', // user-facing value visible in stores
  iosBuildNumber: '1.5.1', // developer-facing build version, see https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion
  androidVersionCode: 23, // developer-facing build version, see https://developer.android.com/studio/publish/versioning.html#versioningsettings
}

// - Environment variables are available in the mobile app source code via the expo-constants package.
// - Evaluation occurs "statically" at build time.
// - Evaluated when running expo:dev, using the values set in the execution environment.
//   Use `.envrc` / `.envrc.local` and the `.env.$environment` to set values.
// - Evaluated when running eas build, using values set in the profiles in eas.json.
const requiredEnvVar = (variableName) => {
  if (!process.env[variableName]) {
    throw new Error(`Missing required environment variable ${variableName}`)
  }
  return process.env[variableName]
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
      package: 'social.holi.app',
      versionCode: versions.androidVersionCode,
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
        serverName: requiredEnvVar('HOLI_CHAT_SERVER_NAME'),
        serverLoginUrl: requiredEnvVar('HOLI_API_GATEWAY') + '/api/chatlogin',
        serverUrl: requiredEnvVar('HOLI_CHAT_SERVER_URL'),
      },
      ory: {
        url: requiredEnvVar('ORY_BASE_URL'),
      },
      holi_api: {
        url: requiredEnvVar('HOLI_API_URL'),
        gateway: requiredEnvVar('HOLI_API_GATEWAY'),
      },
      holi_nextjs_api: {
        url: requiredEnvVar('HOLI_NEXTJS_API_URL'),
      },
      environment: requiredEnvVar('ENVIRONMENT_ID'),
      sentry: {
        dsn: requiredEnvVar('SENTRY_DSN'),
      },
      owncloud: {
        url: requiredEnvVar('OWNCLOUD_BASE_URL'),
      },
      jitsi: {
        url: requiredEnvVar('JITSI_URL'),
      },
      eas: {
        projectId: requiredEnvVar('EXPO_PROJECT_ID'),
      },
      e2e: {
        userId: requiredEnvVar('E2E_USER_ID'),
      },
    },
  },
}
