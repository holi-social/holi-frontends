module.exports = (api) => {
  api.cache(true)
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          unstable_transformImportMeta: true,
        },
      ],
    ],
    // 'react-native-reanimated/plugin' must to be last in the plugins array
    plugins: ['react-native-reanimated/plugin'],
  }
}
