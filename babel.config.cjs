module.exports = {
  presets: [
    'babel-preset-expo',
    '@babel/preset-typescript',
    [
      'react-native-unistyles/plugin',
      {
        root: 'holi-bricks/components',
        autoProcessImports: ['holi-bricks/styles'],
      },
    ],
  ],
}
