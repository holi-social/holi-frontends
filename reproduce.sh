# install sponge and jq (we will need these later)
brew install moreutils jq

PROJECT_ROOT=holi-react-native-setup

mkdir $PROJECT_ROOT
cd $PROJECT_ROOT

mkdir shared mobile web

cat << ROOT_PACKAGE > package.json
{
  "name": "holi-react-native-setup",
  "private": true,
  "workspaces": {
    "packages" : [
      "shared",
      "mobile",
      "web"
    ],
    "nohoist": ["**/react-native", "**/react-native/**"]
  }
}
ROOT_PACKAGE

# create web project
npx create-next-app@latest --ts web
rm -rf web/.git/
cat web/package.json | jq '. += {"version":"1.0.0"}' | sponge web/package.json

# create mobile project
expo init mobile --name $PROJECT_ROOT --yarn --template expo-template-blank-typescript
rm -rf mobile/.git/
cat mobile/package.json | jq '. += {"version":"1.0.0"}' | sponge mobile/package.json

cat << SHARED_PACKAGE > shared/package.json
{
	"name": "shared",
	"version": "1.0.0"

}
SHARED_PACKAGE

rm -r mobile/node_modules
rm -r web/node_modules

cat mobile/package.json | jq '.dependencies += {"shared":"*"}' | sponge mobile/package.json
cat web/package.json    | jq '.dependencies += {"shared":"*"}' | sponge web/package.json

yarn install

########################################################################################################################
# see https://docs.expo.dev/guides/monorepos/
########################################################################################################################

cat << METRO_CONFIG > mobile/metro.config.js
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the workspace root, this can be replaced with 'find-yarn-workspace-root'
const findWorkspaceRoot = require('find-yarn-workspace-root');
const workspaceRoot = findWorkspaceRoot(__dirname);
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
METRO_CONFIG

cat << MOBILE_ENTRYPOINT > mobile/index.js
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
MOBILE_ENTRYPOINT

cat mobile/package.json | jq '. += {"main": "index.js"}' | sponge mobile/package.json

########################################################################################################################

yarn workspace web add next-transpile-modules next-compose-plugins

cat << NEXT_CONFIG > web/next.config.js

const withPlugins = require('next-compose-plugins');
const withTM = require("next-transpile-modules");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = withPlugins(
  [
    withTM(["../shared"], {resolveSymlinks: true, debug: true}),
  ],
  nextConfig
);
NEXT_CONFIG

########################################################################################################################

cat << SAMPLE_SHARED_API > shared/api.ts
export interface UserData {
  id: string
}

export function getUsers(): Promise<Array<UserData>> {
  return Promise.resolve([{id:"123"},{id:"321"}])
}
SAMPLE_SHARED_API

cat << SAMPLE_SHARED_COMPONENT > shared/Users.tsx
import { StyleSheet, Text, View } from 'react-native'
import { UserData } from 'shared/api'

export default function Users({users}: {users: Array<UserData>}) {
  return <>
    {users.map(user => <Text key={user.id}>User ID: {user.id}</Text>)}
  </>
}
SAMPLE_SHARED_COMPONENT

########################################################################################################################

yarn workspace web add react-native-web babel-plugin-react-native-web

cat << NEXT_CONFIG > web/next.config.js

const withPlugins = require('next-compose-plugins');
const withTM = require("next-transpile-modules");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: "build",
  webpack: (config) => {
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
  },
}

module.exports = withPlugins(
  [
    withTM(["../shared"], {resolveSymlinks: true, debug: true}),
  ],
  nextConfig
);
NEXT_CONFIG

cat << BABEL_CONFIG > web/babel.config.js
module.exports = {
  presets: ["next/babel"],
  plugins: [["react-native-web", { commonjs: true }]],
};
BABEL_CONFIG

########################################################################################################################

cat mobile/package.json | jq '.dependencies += {"react": "17.0.2"}'     | sponge mobile/package.json
cat mobile/package.json | jq '.dependencies += {"react-dom": "17.0.2"}' | sponge mobile/package.json
cat web/package.json    | jq '.dependencies += {"react": "17.0.2"}'     | sponge web/package.json
cat web/package.json    | jq '.dependencies += {"react-dom": "17.0.2"}' | sponge web/package.json

yarn install

########################################################################################################################

yarn workspace mobile run start
yarn workspace web run dev

