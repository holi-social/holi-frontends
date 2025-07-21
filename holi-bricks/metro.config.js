/* eslint-disable @typescript-eslint/no-var-requires */
// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')
const withStorybook = require('@storybook/react-native/metro/withStorybook')

const defaultConfig = getDefaultConfig(__dirname)

module.exports = withStorybook(defaultConfig, {
  configPath: path.resolve(__dirname, './storybook/mobile'),
})
