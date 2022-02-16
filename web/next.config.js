
const withPlugins = require('next-compose-plugins');
const withTM = require("next-transpile-modules");
const withFonts = require('next-fonts');
const { withExpo } = require('@expo/next-adapter');

const webpackConfig = (config) => {
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    // Transform all direct 'react-native' imports to 'react-native-web'
    "react-native$": "react-native-web",
  };
  config.resolve.extensions = [
    ".web.js",
    ".web.ts",
    ".web.tsx",
    ...config.resolve.extensions,
  ];
  return config;
}

const fontsConfig = {
  enableSvg: true,
  projectRoot: __dirname,
  // webpack: webpackConfig,
}

const modulesToTranspile = [
  'react-native-web',
  'react-native-svg',
  'native-base',
  'react-native-svg',
  '../shared',
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: "build",
  webpack: webpackConfig,
}

module.exports = withPlugins(
  [
    withTM(modulesToTranspile, {resolveSymlinks: true, debug: true}),
    // withFonts(fontsConfig),
    [withFonts, { projectRoot: __dirname }],
    // [withExpo, { projectRoot: __dirname }],
    // [withExpo, { projectRoot: __dirname + '/..' }],
  ],
  nextConfig
);
