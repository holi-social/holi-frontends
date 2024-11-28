/* eslint-disable @typescript-eslint/no-var-requires */
// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const defaultConfig = getDefaultConfig(__dirname)
const withStorybook = require('@storybook/react-native/metro/withStorybook')

defaultConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  const defaultResolveResult = context.resolveRequest(context, moduleName, platform)

  if (process.env.STORYBOOK_ENABLED !== 'true' && defaultResolveResult?.filePath?.includes?.('.ondevice/')) {
    return {
      type: 'empty',
    }
  }

  return defaultResolveResult
}

module.exports = withStorybook(defaultConfig, {
  enabled: true,
  configPath: path.resolve(__dirname, './ondevice'),
})
