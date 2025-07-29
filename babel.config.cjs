module.exports = {
  presets: ['babel-preset-expo', '@babel/preset-typescript'],
  plugins: [
    [
      'react-native-unistyles/plugin',
      {
        root: 'holi-bricks/components',
        autoProcessImports: ['holi-bricks/styles'],
      },
    ],
  ],
}
