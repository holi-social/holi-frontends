module.exports = {
  presets: ['next/babel'],
  plugins: [
    'react-native-reanimated/plugin',
    'jotai/babel/plugin-react-refresh',
    'jotai/babel/plugin-debug-label',
    '@babel/plugin-proposal-export-namespace-from',
    [
      'react-native-unistyles/plugin',
      {
        // pass root folder of your application
        // all files under this folder will be processed by the Babel plugin.
        root: './',
      },
    ],
  ],
}
