module.exports = {
  presets: ['next/babel', '@babel/preset-typescript', ['babel-preset-expo', { jsxRuntime: 'automatic' }]],
  include: ['react-native-calendars'],
  plugins: [
    ['react-native-web', { commonjs: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    '@babel/plugin-proposal-export-namespace-from',
    'react-native-reanimated/plugin',
  ],
}
