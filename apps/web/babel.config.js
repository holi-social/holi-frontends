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
        root: 'holi-bricks/components',
        autoProcessImports: ['holi-bricks/styles'],
      },
    ],
    // console removal for production builds since the next compiler is disabled
    ...(process.env.NODE_ENV !== 'development' ? ['babel-plugin-transform-remove-console'] : []),
  ],
}
