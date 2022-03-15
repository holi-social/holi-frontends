module.exports = {
  presets: [
    "next/babel",
    // "@babel/preset-typescript",
    ["babel-preset-expo", { "jsxRuntime": "automatic" }]
  ],
  plugins: [
    ["react-native-web", { commonjs: true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    ["@babel/plugin-proposal-private-methods", { "loose": true }],
    ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
    "react-native-reanimated/plugin"
  ]
}
