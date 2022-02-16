# Tested on macOS, not as a script but as a series of copy and paste operations.
# Should in theory be working as a script. No error handling whatsoever, so be careful.

# install sponge and jq (we will need these later)
brew install moreutils jq

# install nodenv for managing the node version
brew install nodenv

# install node.js
echo "16.14.0" > .node-version
nodenv install

PROJECT_ROOT=holi-react-native-setup

mkdir $PROJECT_ROOT
cd $PROJECT_ROOT

mkdir shared mobile web

# create a (non-publishable) root package, bundling together shared, mobile & web packages
# for the meaning of nohoist, see https://classic.yarnpkg.com/blog/2018/02/15/nohoist/
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

# create web package
npx create-next-app@latest --ts web
rm -rf web/.git/
cat web/package.json | jq '. += {"version":"1.0.0"}' | sponge web/package.json

# create mobile package
expo init mobile --name $PROJECT_ROOT --yarn --template expo-template-blank-typescript
rm -rf mobile/.git/
cat mobile/package.json | jq '. += {"version":"1.0.0"}' | sponge mobile/package.json

# create shared package
cat << SHARED_PACKAGE > shared/package.json
{
	"name": "shared",
	"version": "1.0.0"

}
SHARED_PACKAGE

# 'create-next-app' and 'expo init' have installed their dependencies within the '$PROJECT_ROOT/mobile/node_modules'
# and '$PROJECT_ROOT/web/node_modules' folders. using yarn workspaces, these should be hoisted in
# '$PROJECT_ROOT/node_modules' so we remove these again and run yarn install from '$PROJECT_ROOT/' afterwards
rm -r mobile/node_modules
rm -r web/node_modules

# 'mobile' and 'web' shall depend on 'shared', using symlinks via yarn workspaces
cat mobile/package.json | jq '.dependencies += {"shared":"*"}' | sponge mobile/package.json
cat web/package.json    | jq '.dependencies += {"shared":"*"}' | sponge web/package.json

yarn install

########################################################################################################################
# As the 'mobile' package will use *source code* from the 'shared' package, we need to configure 'mobile' in a way that
# the 'shared' source code can be found and transpiled. If we were using shared code as a library, code would already
# have been transpiled. But using our monorepo approach, this is not the case.
# 
# See https://docs.expo.dev/guides/monorepos/
########################################################################################################################

yarn workspace mobile add --dev find-yarn-workspace-root

cat << METRO_CONFIG > mobile/metro.config.js
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

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
# 'web' has the same issue as 'mobile' before. The 'web' build process needs to transpile source code from the 'shared'
# package, so we have to configure it accordingly. To be able to do this, babel will rewrite every import from
# 'react-native' to 'react-native-web'. 
#
# Also see https://necolas.github.io/react-native-web/docs/setup/.
########################################################################################################################

# strictly speaking, 'next-compose-plugins' is not necessary but it helps to make code readable & writable
yarn workspace web add next-transpile-modules next-compose-plugins react-native-web babel-plugin-react-native-web

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
# At the time of writing this, using 'create-next-app' and 'expo init' lead to the two of them using slightly different
# versions of react, resulting in build time (or runtime?) exceptions. Here, we make sure that they're on the same
# version. This most likely has to be adopted in the future.
# 
# https://reactjs.org/warnings/invalid-hook-call-warning.html#mismatching-versions-of-react-and-react-dom
########################################################################################################################

cat mobile/package.json | jq '.dependencies += {"react": "17.0.2"}'     | sponge mobile/package.json
cat mobile/package.json | jq '.dependencies += {"react-dom": "17.0.2"}' | sponge mobile/package.json
cat web/package.json    | jq '.dependencies += {"react": "17.0.2"}'     | sponge web/package.json
cat web/package.json    | jq '.dependencies += {"react-dom": "17.0.2"}' | sponge web/package.json

yarn install

########################################################################################################################
# Add some sample code to the 'shared' package so that we can use it in 'mobile' and 'web'
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

yarn workspace mobile run start
yarn workspace web run dev

