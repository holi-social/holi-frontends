
const withPlugins = require('next-compose-plugins');
const withTM = require("next-transpile-modules");
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: "build",
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct 'react-native' imports to 'react-native-web'
      "react-native$": "react-native-web",
      "react-native-svg": "react-native-svg-web"
    };
    config.resolve.extensions = [
      ".web.js",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ];
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles'), path.join(__dirname, 'shared/data')],
  },
}

module.exports = withPlugins(
  [
    withTM(["react-native-reanimated", "react-native-cards-swipe", "shared"], {resolveSymlinks: true, debug: true}),
  ],
  nextConfig
);
