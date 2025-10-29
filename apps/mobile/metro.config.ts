/* eslint-disable @typescript-eslint/no-var-requires */
// Learn more https://docs.expo.io/guides/customizing-metro
const sentry = require('@sentry/react-native/metro')

const findWorkspaceRoot = require('find-yarn-workspace-root')
const path = require('path')

// Find the workspace root, this can be replaced with 'find-yarn-workspace-root'
const workspaceRoot = findWorkspaceRoot(__dirname) as string
const projectRoot = __dirname
const defaultConfig = sentry.getSentryExpoConfig(projectRoot)

const config = {
  ...defaultConfig,
  watchFolders: [...(defaultConfig.watchFolders || []), workspaceRoot],
  resolver: {
    ...defaultConfig?.resolver,
    // Let Metro know where to resolve packages, and in what order
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules'), path.resolve(workspaceRoot, 'node_modules')],
    // add "cjs" extension for apollo client (see https://github.com/apollographql/apollo-client/blob/main/CHANGELOG.md#apollo-client-354-2021-11-19)
    sourceExts: [...(defaultConfig?.resolver?.sourceExts || []), 'cjs', 'mjs'],
    assetExts: [...defaultConfig.resolver.assetExts, 'lottie'],
    disableHierarchicalLookup: false,
  },
}

module.exports = config
