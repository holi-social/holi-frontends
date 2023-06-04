module.exports = (api) => {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        '@babel/plugin-proposal-private-methods',
        {
          loose: true,
          shippedProposals: true,
        },
      ],
    ],
  }
}
