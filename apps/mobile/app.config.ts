// eslint-disable-next-line
import { ExpoConfig } from 'expo/config'

require('ts-node/register')

// see https://docs.expo.dev/build-reference/app-versions/
// TODO somehow automatically increment version numbers on every release
const versions = {
  version: '1.46.0', // user-facing value visible in stores
  iosBuildNumber: '1.46.0', // developer-facing build version, see https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion
  androidVersionCode: 135, // developer-facing build version, see https://developer.android.com/studio/publish/versioning.html#versioningsettings
}

// - Environment variables are available in the mobile app source code via the expo-constants package.
// - Evaluation occurs "statically" at build time.
// - Evaluated when running expo:dev, using the values set in the execution environment.
//   Use `.envrc` / `.envrc.local` and the `.env.$environment` to set values.
// - Evaluated when running eas build, using values set in the profiles in eas.json.
const requiredEnvVar = (variableName: string) => {
  if (!process.env[variableName]) {
    throw new Error(`Missing required environment variable ${variableName}`)
  }
  return process.env[variableName]
}

// Used to create different apps for different environments (e.g. production, development) so they can be
// installed alongside each other on developers devices. See eas.json for available profile names.
requiredEnvVar('APP_VARIANT')
let appName: string, iOSBundleIdentifier: string, androidPackage: string, googleServicesFile: string
switch (process.env.APP_VARIANT) {
  case 'production':
    appName = 'holi'
    iOSBundleIdentifier = 'social.holi'
    androidPackage = 'social.holi.app'
    googleServicesFile = './google-services.json'
    break
  case 'development':
    appName = 'holi (dev)'
    iOSBundleIdentifier = 'social.holi.dev'
    androidPackage = 'social.holi.app.dev'
    googleServicesFile = './google-services-dev.json'
    break
  default:
    throw new Error(`Unknown APP_VARIANT ${process.env.APP_VARIANT}`)
}

const config: ExpoConfig = {
  name: appName,
  slug: 'projectholi',
  owner: 'holistic-foundation',
  version: versions.version,
  orientation: 'portrait',
  icon: './assets/icon.png',
  jsEngine: 'hermes',
  scheme: 'holi',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#F5F5F5',
  },
  updates: {
    url: 'https://u.expo.dev/78a9da0e-cc1c-48af-92aa-78b755f75183', // needed for EAS updates
    fallbackToCacheTimeout: 3000,
  },
  runtimeVersion: {
    // 'fingerprint' allows to always target compatible native runtimes, see https://expo.dev/blog/fingerprint-your-native-runtime
    // temporarily reverted 'fingerprint' to 'sdkVersion' (see HOLI-10357)
    policy: 'sdkVersion',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: iOSBundleIdentifier,
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
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryDiskSpace',
          NSPrivacyAccessedAPITypeReasons: ['7D9E.1', 'E174.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
          NSPrivacyAccessedAPITypeReasons: ['C617.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['1C8F.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategorySystemBootTime',
          NSPrivacyAccessedAPITypeReasons: ['3D61.1'],
        },
      ],
    },
    associatedDomains: [
      'applinks:app.holi.social',
      'applinks:holi.social',
      'applinks:dev.holi.social',
      'applinks:*.dev.holi.social',
      'applinks:staging.dev.holi.social',
    ],
  },
  android: {
    package: androidPackage,
    versionCode: versions.androidVersionCode,
    // used for FCM push notifications, see https://docs.expo.dev/push-notifications/push-notifications-setup/#android
    googleServicesFile: googleServicesFile,
    adaptiveIcon: {
      foregroundImage: './assets/icon_android.png',
      monochromeImage: './assets/icon_android_monochromatic.png',
      backgroundColor: '#fdfd80',
    },
    permissions: [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.MODIFY_AUDIO_SETTINGS',
    ],
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: 'app.holi.social',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
    softwareKeyboardLayoutMode: 'pan',
  },
  plugins: [
    'expo-localization',
    'expo-secure-store',
    [
      '@sentry/react-native/expo',
      {
        organization: 'holistic-foundation',
        project: 'holi-app-mobile',
      },
    ],
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
        recordAudioAndroid: true,
      },
    ],
    [
      'expo-calendar',
      {
        calendarPermission: 'Allow access to your calendar',
      },
    ],
    // HOLI-9792: Create a new development build to bundle fonts
    // [
    //   'expo-font',
    //   {
    //     fonts: [
    //       '../../holi-bricks/components/text/fonts/InstrumentSans-Regular.ttf',
    //       '../../holi-bricks/components/text/fonts/InstrumentSans-Medium.ttf',
    //     ],
    //   },
    // ],
  ],
  // This doesn't seems to be supported by the expo config.
  // hooks: {
  //   postPublish: [
  //     {
  //       file: 'sentry-expo/upload-sourcemaps',
  //       config: {
  //         organization: 'holistic-foundation',
  //         project: 'holi-app-mobile',
  //       },
  //     },
  //   ],
  // },
  extra: {
    novu: {
      applicationIdentifier: requiredEnvVar('NOVU_APPLICATION_IDENTIFIER'),
      backendUrl: requiredEnvVar('NOVU_BACKEND_URL'),
      socketUrl: requiredEnvVar('NOVU_SOCKET_URL'),
      credentialsUrl: requiredEnvVar('HOLI_API_GATEWAY') + '/api/novu/credentials',
    },
    chat: {
      serverName: requiredEnvVar('HOLI_CHAT_SERVER_NAME'),
      serverLoginUrl: requiredEnvVar('HOLI_API_GATEWAY') + '/api/chatlogin',
      serverUrl: requiredEnvVar('HOLI_CHAT_SERVER_URL'),
      pushGatewayUrl: requiredEnvVar('HOLI_CHAT_PUSH_GATEWAY_URL'),
      adminUserId: requiredEnvVar('HOLI_CHAT_ADMIN_USER_ID'),
      adminName: requiredEnvVar('HOLI_CHAT_ADMIN_NAME'),
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
      projectId: process.env.EXPO_PROJECT_ID,
      // see https://docs.expo.dev/build-reference/variables/#built-in-environment-variables
      buildId: process.env.EAS_BUILD_ID,
      profile: process.env.EAS_BUILD_PROFILE,
      gitCommitHash: process.env.EAS_BUILD_GIT_COMMIT_HASH,
    },
    e2e: {
      userId: process.env.E2E_USER_ID, // not required as not used in production
    },
    holi_challenges_app: requiredEnvVar('HOLI_CHALLENGES_APP'),
    posthog: {
      key: requiredEnvVar('POSTHOG_KEY'),
      host: requiredEnvVar('POSTHOG_HOST'),
    },
    typesense: {
      host: requiredEnvVar('TYPESENSE_HOST'),
      port: requiredEnvVar('TYPESENSE_PORT'),
      protocol: requiredEnvVar('TYPESENSE_PROTOCOL'),
      apiKey: requiredEnvVar('TYPESENSE_API_KEY'),
      collection: requiredEnvVar('TYPESENSE_COLLECTION'),
    },
  },
}

module.exports = config
