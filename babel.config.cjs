module.exports = {
  presets: ['babel-preset-expo', '@babel/preset-typescript'],
  plugins: [
    [
      'react-native-unistyles/plugin',
      {
        root: 'holi-bricks',
        autoProcessImports: ['holi-bricks/styles'],
      },
    ],
  ],
}
