# holi-react-native-setup

## Requirements

Before we can get started building, please ensure that both [`direnv`](https://github.com/direnv/direnv/) and one of the following node version managers are installed and properly set up on your system:

- [`nodenv`](https://github.com/nodenv/nodenv) or
- [`nvm`](https://github.com/nvm-sh/nvm)

Follow the instructions in the corresponding READMEs for setup.

Run `cp .envrc-local.template .envrc-local` and adjust `.envrc-local` to match your configuration (e.g. using the correct node version manager). Using `direnv`, `.envrc` (and `.envrc-local`) will automatically be loaded when you `cd` into the directory.

`.node-version` (used by `nodenv`) ensures that all developers are using the same `node`/`npm` versions.
It is kept in sync with `.nvmrc` (used by `nvm`) by a symbolic link, so please make sure to use a format that is understood by both tools (e.g. a fixed version).

## Running

Run `yarn mobile:dev` for mobile and `yarn web:dev` for web.

Start the mock api with `yarn mock-api:dev`.

We are using [Expo](https://docs.expo.dev/) to build the app for both mobile app variants.

### Android emulator

- Follow the instructions to install [Android studio](https://docs.expo.dev/workflow/android-studio-emulator/)
- Create an adb device using the Virtual Device Manager from Android Studio
- Add `<path-to-android-sdk>/emulator` to your `PATH` environment variable
- Start the emulator using `emulator @<device-name>`
- Run `adb devices`: Make sure the adb daemon could be started and the emulator is listed
- `yarn mobile:dev` > `a`
- Note: Pressing `w` to open the web app is not expected to work - use `yarn web:dev` instead

### iOS simulator

- Follow the instructions to install [Xcode](https://docs.expo.dev/workflow/ios-simulator/) and setup a simulator
- `yarn mobile:dev` > `i`

## Install libs / packages

For convience reasons you might want to stay in the project root folder. From here you can add new packages with the
command:

`yarn workspace [workspace-name] add [package-name]`

e.g.
`yarn workspace @holi/web add typescript -D`
or
`yarn workspace @holi/mobile expo install react-native-gesture-handler`

Alternatively, you can also go into the specific folder where you need the new lib and install it there:

```sh
cd web
yarn add typescript -D
```

## Monorepo - and why

This is a monorepo. Not in the FAANG sense, as it doesn't contain thousands of applications. It contains two
applications: mobile & web. And shared code between mobile & web. This is the one and only reason we create a monorepo.

Monorepos have been critized heavily and righteously so. Most downsides of monorepos come from frameworks and build
systems not supporting monorepos. Therefore, working with monorepos feels like glueing together many workarounds until
it works and hoping it won't break.

On the positive side, this monorepo will allow us to share code between our mobile and web frontend. You can do this
without a monorepo, using a library. However, using a library for shared code, you need to publish every little code
change (locally) before you can try it out in the applications that use it. This would dramatically decrease development
velocity as feedback cycles for shared code changes are simply too long. And it's no fun do work this way either.

### Yarn Workspaces

Yarn Workspaces are a neat feature that support us with our monorepo approach. It allows to make multiple packages
(e.g. `@holi/core`, `@holi/mobile` and `@holi/web`) and group them together in a (non-publishable) root package. With
[Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces):

- Your dependencies can be linked together, which means that your workspaces can depend on one another while always
  using the most up-to-date code available. `mobile` and `web` can depend on `shared`, always pointing to the "newest
  version" by simply symlinking into the directory.

- All dependencies are installed together (under the root module), using a single lockfile. There can be exceptions if
  needed. If you have issues, check if [nohoist](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/) will help.

Working with Yarn Workspaces is (a little) different, but easy. Instead of running e.g.

```sh
holi-react-native-setup/ $> cd mobile
holi-react-native-setup/mobile $> yarn run start
```

you _can_ simply prefix every yarn command with `yarn workspace $MODULE_NAME` like so:

```sh
holi-react-native-setup/ $> yarn workspace @holi/mobile run start
```

But notice that _you don't have to_ do this, you can also `cd` into the individual packages and use yarn as if you
weren't in a monorepo with yarn Workspaces.

### (Adding) Dependencies

Due to the monorepo layout and how hoisting works we have to follow a couple of rules that "magically" make everything
work (to the best of our *current* knowledge):

- **root**: don't add any dependencies here
  - *exception*: dev dependencies that understand monorepos like `eslint`
- **shared**: don't add any dependencies here
- **mobile**: add all your React Native and universal (both mobile and web) dependencies here
- **web**: add your web-only dependencies here

We have tried different approaches before that were using `nohoist` and more "obvious" / "intuitive" / "known"
patterns (e.g. adding universal dependencies in both web and mobile, or in shared only). However, these approaches
always led to one or another build failing: either `expo publish`, `eas build` or local execution.

It might be necessary to work
with [Yarn resolutions](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/) to resolve dependency
conflicts (as has been done e.g. with `ts-invariant`).

Please also note that not all dependency versions are compatible with the current version of Expo.
Running `expo doctor --fix-dependencies` might then help to fix this.

### Clean up

To clean up builds you can run

```sh
yarn clean
```

in the root directory or a specific workspace.

In order to clean up everything including `node_modules` directories you can run

```sh
yarn clean:all
```

in the root directory or a specific workspace.

### How to Reproduce (Built this from scratch)

Simply cloning a monorepo template from the Internet won't help you understand how everything is glued together. And if
you don't, it's quite likely that you're going to have a hard time as soon as something breaks. At that point you might
be months into your project, the code base has become huge and debugging your monorepo issues has become harder as it
will be harder to see the forest for the trees.

To avoid this situation, `reproduce.sh` contains every single instruction that was used to create this monorepo. And
quite a number of comments on what we're doing and why. This should allow you to understand the process and the
reasoning behind it. If you run into problems half a year into the project, this monorepo template (and `reproduce.sh`)
allows you to go back in time and debug your monorepo issue on a smaller less cluttered code base. That's the idea, we
hope it will pay out.

## Navigation

To create a new route with a screen for mobile and page for web you have to do the following.

Say you wanted to create the route "/profile/:id" which opened the profile page in web and a profile screen in mobile.

### shared

- create core/profile/id.tsx
  - implement a shared view for the profile you want to render
  - use `const { query: { id } } = useRouting()` hook retrieve the id query param

### web

- create web/pages/profile/[id].tsx
  - render the shared screen within the

```ts
const ProfilePage: NextPage = () => <ProfileScreen / >
export default ProfilePage
```

### mobile

- create a route in `apps/mobile/navigation/rootNavigator.tsx` e.g. in the RootStack and use the shared screen component to render

```ts
<RootStack.Screen name = "Profile"
component = {ProfileScreen}
/>
```

- create a linking mapping in `core/navigation/index.tsx` between the navigator route name and the web url

```ts
// ...
config: {
    screens: {
        // ...
        Profile: '/profile/:id',
    }
}
```

### conclusion

you can now navigate from anywhere in web and mobile using the navigate function exposed by the useRouting hook.

```ts
const {navigate} = useRouting()

< Button
onPress = {()
=>
navigate('/profile/jasper')
}>
jaspers
profile < /Button>
```

### notes

**Important hint: A screen name must be unique.**

It may be configured at different places, but over all it must be unique.

```tsx
// e.g.
<RootStack.Screen name="Spaces" component={SpacesNavigator} />
<SpacesDrawer.Screen name="AppStore" component={AppStoreScreen} />
<CommunityBottomNav.Screen name="Board" component={BoardScreen} />
```
