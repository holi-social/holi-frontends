/* eslint-disable @typescript-eslint/no-var-requires */
// Learn more https://docs.expo.io/guides/customizing-metro
import { getSentryExpoConfig } from '@sentry/react-native/metro'
import { type MetroConfig } from 'expo/metro-config'
import findWorkspaceRoot from 'find-yarn-workspace-root'
import path from 'path'

// Find the workspace root, this can be replaced with 'find-yarn-workspace-root'
const workspaceRoot = findWorkspaceRoot(__dirname) as string
const projectRoot = __dirname
const defaultConfig = getSentryExpoConfig(projectRoot)
const config = {
  ...defaultConfig,
  watchFolders: [workspaceRoot], // Watch all files within the monorepo
  resolver: {
    ...defaultConfig?.resolver,
    // Let Metro know where to resolve packages, and in what order
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules'), path.resolve(workspaceRoot, 'node_modules')],
    // add "cjs" extension for apollo client (see https://github.com/apollographql/apollo-client/blob/main/CHANGELOG.md#apollo-client-354-2021-11-19)
    sourceExts: [...(defaultConfig?.resolver?.sourceExts || []), 'cjs', 'mjs'],
  },
} as MetroConfig

module.exports = config
