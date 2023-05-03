module.exports = {
  presets: ['next/babel', '@babel/preset-typescript', ['babel-preset-expo', { jsxRuntime: 'automatic' }]],
  plugins: [
    ['react-native-web', { commonjs: true }],
    '@babel/plugin-proposal-export-namespace-from',
    'react-native-reanimated/plugin',
  ],
}
