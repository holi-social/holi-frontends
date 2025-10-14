/* eslint-disable @typescript-eslint/no-var-requires */
// Learn more https://docs.expo.io/guides/customizing-metro
const sentry = require('@sentry/react-native/metro')
const { getDefaultConfig } = require('@expo/metro-config')

const findWorkspaceRoot = require('find-yarn-workspace-root')
const path = require('path')

// Find the workspace root, this can be replaced with 'find-yarn-workspace-root'
const workspaceRoot = findWorkspaceRoot(__dirname) as string
const projectRoot = __dirname

// Get Expo's default config first
const expoDefaultConfig = getDefaultConfig(projectRoot)
// Then wrap with Sentry
const defaultConfig = sentry.getSentryExpoConfig(projectRoot, expoDefaultConfig)

const config = {
  ...defaultConfig,
  projectRoot,
  watchFolders: [workspaceRoot, ...(defaultConfig.watchFolders || [])],
  unstable_enablePackageExports: false,
  transformer: {
    ...defaultConfig?.transformer,
    unstable_allowRequireContext: true,
    // Fix async-require path for monorepo
    asyncRequireModulePath: path.resolve(workspaceRoot, 'node_modules/@expo/metro-runtime/async-require.js'),
    // Enable assets from workspace packages
    assetRegistryPath: '@react-native/assets-registry/registry',
    publicPath: '/assets',
  },
  resolver: {
    ...defaultConfig?.resolver,
    // Let Metro know where to resolve packages, and in what order
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules'), path.resolve(workspaceRoot, 'node_modules')],
    // add "cjs" extension for apollo client (see https://github.com/apollographql/apollo-client/blob/main/CHANGELOG.md#apollo-client-354-2021-11-19)
    sourceExts: [...(defaultConfig?.resolver?.sourceExts || []), 'cjs', 'mjs'],
    assetExts: [...(defaultConfig?.resolver?.assetExts || []), 'lottie'],
    disableHierarchicalLookup: false,
  },
}

module.exports = config
