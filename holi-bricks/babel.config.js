module.exports = (api) => {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      //['babel-plugin-react-docgen-typescript', { exclude: 'node_modules' }], Disable ts docgen for now as it creates only problem while we still reference stuff from old ui lib
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['react-native-unistyles/plugin'],
    ],
  }
}
