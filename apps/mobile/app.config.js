// see https://docs.expo.dev/build-reference/app-versions/
// TODO somehow automatically increment version numbers on every release
const versions = {
  version: '1.0.13', // user-facing value visible in stores
  iosBuildNumber: '1.0.13', // developer-facing build version, see https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion
  androidVersionCode: 13, // developer-facing build version, see https://developer.android.com/studio/publish/versioning.html#versioningsettings
}

export default {
  expo: {
    name: 'Project HOLI',
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
            authToken: '0de4e0e0fa7447bca982f15e0481d2470fa641e9856f4df7983f0e1683c59352',
          },
        },
      ],
    },
    extra: {
      ory: {
        url: process.env.ORY_BASE_URL || 'https://dev-auth.project-holi.org',
      },
      holi_api: {
        url: process.env.HOLI_API_URL || 'http://10.0.2.2:4001/graphql',
      },
      environment: process.env.ENVIRONMENT_ID,
      sentry: {
        dsn: process.env.SENTRY_DSN || 'https://0e50481f84454f9a838a8217085498f0@o949544.ingest.sentry.io/6377191',
      },
      owncloud: {
        url: process.env.OWNCLOUD_BASE_URL || 'https://development.cloud.project-holi.org',
      },
      eas: {
        projectId: process.env.EXPO_PROJECT_ID || '',
      },
    },
  },
}
