module.exports = {
  extends: '../../babel.config.cjs',
  plugins: [
    [
      'react-native-unistyles/plugin',
      {
        root: 'components',
        autoProcessImports: ['holi-bricks/styles'],
      },
    ],
  ],
}
