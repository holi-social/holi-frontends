module.exports = {
  presets: ['next/babel'],
  plugins: [
    'react-native-reanimated/plugin',
    'jotai/babel/plugin-react-refresh',
    'jotai/babel/plugin-debug-label',
    '@babel/plugin-proposal-export-namespace-from',
  ],
}
