# holi-frontends

<!-- TOC -->
- [holi-frontends](#holi-frontends)
  - [Development](#development)
    - [Prerequisites](#prerequisites)
      - [Android emulator](#android-emulator)
      - [iOS simulator (if you have a Mac)](#ios-simulator-if-you-have-a-mac)
      - [Docker (optional)](#docker-optional)
    - [Running](#running)
    - [Automated Testing](#automated-testing)
      - [Web e2e tests](#web-e2e-tests)
  - [Monorepo - and why](#monorepo---and-why)
    - [Yarn Workspaces](#yarn-workspaces)
    - [Workspaces / Package Structure](#workspaces--package-structure)
    - [Code conventions](#code-conventions)
      - [Code style](#code-style)
    - [Dependencies](#dependencies)
      - [Dependencies and Yarn Workspaces](#dependencies-and-yarn-workspaces)
    - [Rules for Adding Dependencies](#rules-for-adding-dependencies)
    - [Clean up](#clean-up)
    - [How to Reproduce (Built this from scratch)](#how-to-reproduce-built-this-from-scratch)
    - [Navigation](#navigation)
      - [core](#core)
      - [web](#web)
      - [mobile](#mobile)
      - [conclusion](#conclusion)
      - [notes](#notes)
    - [I18n (Internationalization)](#i18n-internationalization)
      - [Usage example](#usage-example)
      - [VS Code extension](#vs-code-extension)
  - [Creating NextJS SSR and SSG pages](#creating-nextjs-ssr-and-ssg-pages)
    - [Understanding NextJS data fetching strategies](#understanding-nextjs-data-fetching-strategies)
    - [Creating reusable pages for web and mobile and allowing SSR or SSG on web](#creating-reusable-pages-for-web-and-mobile-and-allowing-ssr-or-ssg-on-web)
      - [Configure the page/screen component to use SSR or SSG:](#configure-the-pagescreen-component-to-use-ssr-or-ssg)
        - [`core/screens/Quote.tsx`](#corescreensquotetsx)
      - [In the web app, in the file corresponding to the page using SSR or SSG:](#in-the-web-app-in-the-file-corresponding-to-the-page-using-ssr-or-ssg)
        - [`apps/web/pages/quote.tsx`](#appswebpagesquotetsx)
  - [Authentication](#authentication)
    - [Mobile](#mobile-1)
    - [Web](#web-1)
  - [Exploring the GraphQL API (via graphiql)](#exploring-the-graphql-api-via-graphiql)
  - [Continuous Integration and Deployment](#continuous-integration-and-deployment)
    - [Feature Branches & Environments](#feature-branches--environments)
    - [Skipping parts of CI](#skipping-parts-of-ci)
      - [noenv Branches](#noenv-branches)
      - [noweb / nomobile Branches](#noweb--nomobile-branches)
    - [Staging and Production Environments](#staging-and-production-environments)
    - [Environment variables](#environment-variables)
      - [Local execution and general usage](#local-execution-and-general-usage)
      - [Configuration for web client](#configuration-for-web-client)
      - [Configuration for web deployment](#configuration-for-web-deployment)
      - [Usage for mobile](#usage-for-mobile)
      - [Configuration for mobile builds](#configuration-for-mobile-builds)
  - [sentry.io logging/tracing](#sentryio-loggingtracing)
  - [Accessibility testing](#accessibility-testing)
<!-- /TOC -->

## Development

### Prerequisites

Before we can get started building, please ensure that both [`direnv`](https://github.com/direnv/direnv/) and one of the following node version managers are installed and properly set up on your system:

- [`nodenv`](https://github.com/nodenv/nodenv) or
- [`nvm`](https://github.com/nvm-sh/nvm)

Follow the instructions in the corresponding READMEs for setup.

Run `cp .envrc.local.template .envrc.local` and adjust `.envrc.local` to match your configuration (e.g. using the correct node version manager). Using `direnv`, `.envrc` (and `.envrc.local`) will automatically be loaded when you `cd` into the directory.

`.node-version` (used by `nodenv`) ensures that all developers are using the same `node`/`npm` versions.
It is kept in sync with `.nvmrc` (used by `nvm`) by a symbolic link, so please make sure to use a format that is understood by both tools (e.g. a fixed version).

#### Android emulator

- Follow the instructions to install [Android studio](https://docs.expo.dev/workflow/android-studio-emulator/)
- Create an adb device using the Virtual Device Manager from Android Studio
  - In order to test accessibility features you need to have the [Android Accessibility Suite](https://holi.atlassian.net/wiki/spaces/HOLI/pages/167280654/Screenreader+Support#Setup-TalkBack-on-an-Android-emulator) installed
- Add `<path-to-android-sdk>/emulator` to your `PATH` environment variable
- Start the emulator using `emulator @<device-name>`
- Run `adb devices`: Make sure the adb daemon could be started and the emulator is listed
- `yarn mobile:dev` > `a`
- Note: Pressing `w` to open the web app is not expected to work - use `yarn web:dev` instead

#### iOS simulator (if you have a Mac)

- Follow the instructions to install [Xcode](https://docs.expo.dev/workflow/ios-simulator/) and setup a simulator
- `yarn mobile:dev` > `i`

#### Docker (optional)

For running the web e2e tests locally, you need to have Docker installed.

### Running

Best way to run a dev environment is to checkout [holi-meta](https://gitlab.com/holisticfoundation/holi-meta) and use
it to quickly start a complete environment.

Locally in this repository, you can run `yarn mobile:dev` for mobile and `yarn web:dev` for web. These will connect
to Staging APIs by default. You can let them connect to other deployments of
[holi-unified-api](https://gitlab.com/holisticfoundation/holi-unified-api/) by providing the environment variable
HOLI_API_URL (see [holi-meta](https://gitlab.com/holisticfoundation/holi-meta)).

We are using [Expo](https://docs.expo.dev/) to build the app for both mobile app variants. After starting the mobile
dev environment (e.g. via [holi-meta](https://gitlab.com/holisticfoundation/holi-meta)), you can start the emulators
with keyboard shortcuts and/or scan the QR code from the console log with the Expo Go App for testing/debugging on your
phone.

### Automated Testing

The unit tests are written with [jest](https://jestjs.io/) and [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/).

Running `yarn test` in the root of this repository (or within any package that has unit tests) will run jest on
all files with unit tests. To run with watch mode, simply use `yarn test:watch` to run tests on uncommitted files,
or `yarn test:watchAll` to run tests in all files.

We are using a jest convention to locate test files within a `__tests__` folder. Jest will run all test files
within those folders, or any files that end with a suffix of .spec.js or .test.js by default.

We use [snapshot tests](https://jestjs.io/docs/snapshot-testing) which generates a `__snapshots__` folder next to
the test file. The goal with snapshot tests is to "make sure your UI does not change unexpectedly".
If there is an intentional change to the UI, you can run `yarn test:update` and it will update the snapshots.
It is recommended to always commit the snapshots folder and keep it in version control.

#### Web e2e tests

The web e2e tests are built with [Playwright](https://playwright.dev/). They are executed in the CI pipeline against
feature branches and the staging system (before a live deployment).

You can run them locally. You need to have Docker installed. Then, follow the instructions in the [README](./e2e/web/README.md)

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
  using the most up-to-date code available. `mobile` and `web` can depend on `core`, always pointing to the "newest
  version" by simply symlinking into the directory.

- All dependencies are installed together (under the root module), using a single lockfile. There can be exceptions if
  needed. If you have issues, check if [nohoist](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/) will help.

Working with Yarn Workspaces is (a little) different, but easy. Instead of running e.g.

```sh
holi-frontends/ $> cd mobile
holi-frontends/mobile $> yarn run start
```

you _can_ simply prefix every yarn command with `yarn workspace $MODULE_NAME` like so:

```sh
holi-frontends/ $> yarn workspace @holi/mobile run start
```

But notice that _you don't have to_ do this, you can also `cd` into the individual packages and use yarn as if you
weren't in a monorepo with yarn Workspaces.

### Workspaces / Package Structure

To give an overview, the project contains the following workspaces (npm packages):

- `apps` - contains platform specific configs, styles and structurally differing code that can not be shared (e.g. the navigation and next.js pages)
  - `mobile` - the mobile ("native" as in React Native) app for iOS and Android, managed by Expo. Contains just the minimal platform-specific code that can not be shared with `web`.
  - `web` - the web (reactive, small and big screen) site, built with React Native for Web and Expo. Contains just the minimal platform-specific code that can not be shared with `mobile`.
  - `storybook` - app to explore UI components. `stories` should be in `packages/ui/components/__stories__`
- `core` - shared code for the core of the HOLI app / site (feature-specific components, screens, ...)
  - `auth` - shared components and helpers for authentication
  - `errors` - shared components and helpers for error handling
  - `i18n` - shared configuration for internationalization
    - `locales` - translations
  - `navigation` - shared components and helpers for navigation
  - `RootProvider.tsx` - shared root provider
  - `screens` - all screens used in the core app
    - `UserProfile` - exmplary for screens in general, contains everything specific to this screen that is not shared, no 'Screen' suffix in name
      - `components`
      - `hooks`
      - `providers`
      - `index.tsx`
      - `queries.ts`
      - `types.ts`
- `e2e` - end-to-end tests
  - `mobile` - end-to-end tests for the mobile app
  - `web` - end-to-end tests for the web site
- `holi-apps` - apps for the HOLI app "store" will eventually go here
  - `volunteering` - examplary for holi-apps in general, contains everything specific to this app, structurally equivalent to `screens` in `core`
- `packages` - shared "library" code goes here, i.e. everything reusable that _could_ also be published as an npm package
  - `api` - shared client-side code for the HOLI API
  - `ui` - the HOLI component library
- `terraform`
  - `common` - definitions for common infrastructure
  - `environments` - definitions for the specific platform environments (currently only necessary for web)
    - `web` - definitions for web environment

Components in `packages/ui` and `screens` should use the following folder structure:

- `MyComponent.tsx` - example for a component that is the same for both platforms
- `OtherComponent.tsx` - mobile variant of a component with platform specific variants
- `OtherComponent.web.tsx` - web variant of `OtherComponent`
- `__stories__` - stories for storybook
  - `MyComponent.stories.tsx`
  - `OtherComponent.stories.tsx`
- `__tests__` - component tests
  - `MyCompontent.test.tsx`
  - `OtherComponent.test.tsx`
  - `__snapshots__`
    - `MyCompontent.test.tsx.snap`
    - `OtherComponent.test.tsx.snap`

### Code conventions

- File names: camelCase
- File and folder names for components (basically all `.tsx` files except for `index.tsx`, including screens and tests): PascalCase
  - `.tsx files` in `apps/web` follow the nextjs convention (routing derived from filenames) and therefore are lowercase and might start with an underscore.
- Default instead of named exports, esp. for components. I.e. every file should typically only export one component or function, exceptions might be e.g. collections of util functions. If it necessary to export prop types as well, they may be exported in the same file as the component
  - E.g.

    ```ts
    export type MyComponentProps = [...]

    const MyComponent = [...]

    export default MyComponent
    ```

  - which can be imported as `import MyComponent, { MyComponentProps } from 'path/to/MyComponent'`
- For very complex components that span over multiple files (e.g. screens or platform specific variants), group all files in a folder and provide an `index.tsx` file exporting the root component as default export. This enables importing the component as if it was a single file (using e.g. `import MyComponent from 'path/to/MyComponent'`) and hides the complexity of the component itself.
  - Example:
    - `foobar` - see `core/navigation/hooks/useRouting` as example
      - `foobar.ts` - mobile variant
      - `foobar.web.ts` - web variant
      - `index.ts` - default export
      - `types.ts` - types used by both variants
      - other files required for the component that are not shared
- Tests: Folder `__tests__` next to the files to be tested and `.test` suffix for the test file names, e.g.:
  - `foobar.tsx`
  - `__tests__`
    - `foobar.test.tsx`

#### Code style

We use `eslint` and `prettier` to lint and format the code.
The rules are defined in `.eslintrc.js` resp. `.prettierrc` and are checked by our commit hooks as well as during the CI pipelines.
Make sure to install appropriate IDE plugins to assist writing properly linted code and automate formatting.

### Dependencies

#### Dependencies and Yarn Workspaces

When adding dependencies, for convenience reasons, you might want to stay in the project root folder. From here you can add new packages with the
command:

`yarn workspace [workspace-name] add [package-name]`

e.g.
`yarn workspace @holi/web add typescript -D`
or
`yarn workspace @holi/mobile expo install react-native-gesture-handler`

Alternatively, you can also go into the specific folder where you need the new lib and install it there:

```sh
cd apps/web
yarn add typescript -D
```

Note: Be careful when using `expo install`, as it seems to ignore the resolutions defined in the root `package.json`
and might cause dependency conflicts.

### Rules for Adding Dependencies

Due to the monorepo layout and how hoisting works we have to follow a couple of rules that "magically" make everything work:

- **root**: don't add any dependencies here
  - _exception_: dev dependencies that understand monorepos like `eslint`
- **core**: don't add any dependencies here
- **mobile**: add all your React Native and universal (both mobile and web) dependencies here
- **web**: add your web-only dependencies here

We have tried different approaches before that were using `nohoist` and more "obvious" / "intuitive" / "known"
patterns (e.g. adding universal dependencies in both web and mobile, or in shared only). However, these approaches
always led to one or another build failing: either `expo publish`, `eas build` or local execution.

It might be necessary to work
with [Yarn resolutions](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/) to resolve dependency
conflicts (as has been done e.g. with `ts-invariant` and `tslib`).

- tslib is pinned to 2.3.1 because without this pin, there was an error `TypeError: tslib.__spreadArray is not a function.` (2022-05-04)

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

### Navigation

To create a new route with a screen for mobile and page for web you have to do the following.

Say you wanted to create the route "/profile/:id" which opened the profile page in web and a profile screen in mobile.

#### core

- create core/profile/id.tsx
  - implement a shared view for the profile you want to render
  - use `const { query: { id } } = useRouting()` hook retrieve the id query param

#### web

- create web/pages/profile/[id].tsx
  - render the shared screen within the

```ts
const ProfilePage: NextPage = () => <ProfileScreen / >
export default ProfilePage
```

#### mobile

- create a route in `apps/mobile/navigation/RootNavigator.tsx` e.g. in the RootStack and use the shared screen component to render

```ts
<RootStack.Screen name = "Profile" component =  {ProfileScreen} />
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

#### conclusion

you can now navigate from anywhere in web and mobile using the navigate function exposed by the useRouting hook.

```tsx
const {navigate} = useRouting()

<Button onPress = {() => navigate('/profile/jasper')}>
  jaspers profile
</Button>
```

#### notes

**Important hint: A screen name must be unique.**

It may be configured at different places, but over all it must be unique.

```tsx
// e.g.
<RootStack.Screen name="Spaces" component={SpacesNavigator} />
<SpacesDrawer.Screen name="AppStore" component={AppStoreScreen} />
<CommunityBottomNav.Screen name="Board" component={BoardScreen} />
```

### I18n (Internationalization)

We use [i18next](https://www.i18next.com/) as framework for internationalization with [react-i18next](https://react.i18next.com/) for React/React Native support and rely on [Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) to provide locale data (polyfilled on mobile using [intl](https://www.npmjs.com/package/intl)).

You can find more documentation in [confluence](https://holi.atlassian.net/wiki/spaces/HOLI/pages/181174275/I18n+Internationalization).

We use [namespaces](https://www.i18next.com/principles/namespaces) to separate translations for the core application and the different holi-apps, which can be found in

- `core/i18n/locales`
- `holi-apps/donations/i18n/locales`
- etc.

Message keys should include prefixes separated by `.` for grouping translations e.g. by screen and be represented in a flat JSON structure.
To refer to a translation from a specific namespace use the prefix `<namespace>:`, e.g `donations:app.name`. If no namespace prefix is passed, translations from `core` are used.

#### Usage example

Example translations

```JSON
{
  "message.simple": "Simple translation",
  "message.interpolation": "Interpolation {{value}}",
  "message.nestedComponent": "Translation with a <0>nested component<0>"
}
```

Usage in components

```tsx
import { Trans, useTranslation } from 'react-i18next'

const { t } = useTranslation()

// results in: "Simple translation"
t('message.key')

// results in: "Interpolation example"
t('message.interpolation', { value: 'example' })

// results in: "Translation with a <HoliText styles={{ fontWeight: 'bold' }}>nested component</HoliText>"
<Trans t={t} i18nKey="message.nestedComponent">
  <HoliText style={{ fontWeight: 'bold' }}>this text will be replaced by "nested component"</HoliText>
</Trans>
```

See `holi-apps/donations/components/DonationProgress.tsx` for an example for number formatting using `Intl.NumberFormat`.

#### VS Code extension

[i18n-ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally) is a VS code extension that facilitates
translating the app with features like code completion, directly adding new or editing existing keys as well as displaying translations inside the code and as tooltips.

## Creating NextJS SSR and SSG pages

### Understanding NextJS data fetching strategies

NextJS supports client side rendering (CSR), server side rendering (SSR) and static-site generation (SSG). You can create pages for the web app (`apps/web`) following the same rules as described in the [NextJS docs](https://nextjs.org/docs/basic-features/data-fetching/overview).

### Creating reusable pages for web and mobile and allowing SSR or SSG on web

To be able to use the same page/screen for both web and mobile, it is necessary to create the page/screen component with the rendering strategy in mind. For client side rendering, the data will be fetched in the page/screen component itself, without the need to configure anything for the web app. However, when creating an SSR or SSG page, it is necessary to follow the steps below:

#### Configure the page/screen component to use SSR or SSG:

Say you want to create a new page for the web app, and you want it to use SSR. You also want the same page/screen component to be used both for the mobile and the web apps.

The first step to take would be creating the page/screen component that will be used both for the mobile and web apps. Let's call it `Quote` component and all it does is display a famous quote in the page.

##### `core/screens/Quote.tsx`

```tsx
type QuoteProps = {
  ssr: boolean
  ssrData: T // whatever T is needed for the component
}

const Quote: React.VFC<QuoteProps> = ({ ssr, ssrData }: QuoteProps) => {
  // make sure to use useLazyQuery, so that you can choose when to fetchData
  const [fetchData, { loading, error, data }] = useLazyQuery<T>(quoteQuery)

  useEffect(() => {
    if (!ssr) {
      fetchData()
    }
  }, [])

  if (loading) return <HoliText>Loading...</HoliText>
  if (error) return <HoliText>Error...</HoliText>
  
  const myData = ssr ? ssrData : data
  return <HoliText>My Data: {JSON.stringify(myData)}</HoliText>
}

export default Quote
```

- The `ssrData` will be passed to the page/screen component as a prop, as well as the `ssr` prop will be `true`.
- If there is any data fetching method running on the component initialization (`useEffect`, e.g.), avoid running it if `ssr` is `true`. We already have the `ssrData` as a prop.
- We are using ApolloClient for data fetching, and for SSR usage, make sure to use `useLazyQuery` instead of `useQuery`, to avoid fetching data from the client side as well when using SSR. Read more about these methods on the [Apollo Docs](https://www.apollographql.com/docs/react/api/react/hooks/).

Please note that `ssr` will only be set to true when decided to use SSR in the web app. Never in the mobile app.

#### In the web app, in the file corresponding to the page using SSR or SSG:

##### `apps/web/pages/quote.tsx`

```tsx
import { NextPage } from 'next'

import Quote, { QuoteType } from '@holi/core/screens/Quote'
import { ApolloClient, gql } from "@apollo/client";

const client = new ApolloClient({
    uri: API_URL
});

const QuotesPage: NextPage = ({ ssrData }) => <Quote ssr={true} ssrData={ssrData} />

export const getServerSideProps = async () => {
  const { data } = await client.query({
    query: gql`
      query Quote {
        quote {
          title
          author
        }
      }
    `,
  });

  return { props: { ssrData: data } }
}

export default QuotesPage
```

- Include the `ssr` and `ssrData` props in the page/screen component. Set `ssr` to `true` and pass the `ssrData` as a prop to the component. If it's client side rendering, no need to use any data fetching strategy from NextJS (no `getServerSideProps` in this example).
- Include the corresponding pre-rendering methods (`getServerSideProps` and `getStaticProps`) as described in the [NextJS docs](https://nextjs.org/docs/basic-features/data-fetching/overview).
- The data fetched will be passed to the page/screen component as a prop.

## Authentication

Authentication works differently for Web and Mobile (following the best practices of our identity provider
[Ory](https://www.ory.sh)):

### Mobile

The session token that is retrieved during login is stored in the phones `SecureStore` (from `expo-secure-store`). Every
request that is sent to the backend (our `holi-unified-api` GraphQL API) receives an HTTP
request header `Authorization: Bearer $TOKEN`.

### Web

During login, Ory (respectively the Ory API bridge, see `apps/web/pages/api/.ory/[...paths].js`) sets an HTTP-only
secure cookie with domain-wide validity that includes a session token. This cookie is then sent with every request to
the backend (which is reverse-proxied on Next.JS server side, see `apps/web/pages/api/graphql.js`).

## Exploring the GraphQL API (via graphiql)

For exploring our GraphQL API we have a running instance
of [graphiql](https://graphql-dotnet.github.io/docs/getting-started/graphiql/) at <https://staging.web.project-holi.org/>

If all your requests don't need user authentication you can do them right away. Currently we don't have any GraphQL
queries that work without authentication but there will be some in the future.

If you need authentication (example for staging):

1. Go to our [web deployment](https://staging.web.project-holi.org/)) and log in with your user.
2. From the network view of the Browser, check the request that went to the GraphQL API
   (`https://staging.web.project-holi.org/api/graphql`) and copy the value from the Cookie request header.
3. Go to the [staging graphiql instance](https://staging.unified.apis.project-holi.org/graphql), open the "Request
   Headers" tab in the lower left and add the previously copied cookie values like so:

```json
{
  "Cookie": "<Cookies-Value-Previously-Copied>"
}
```

4. Write and submit your queries.

As an alternative to using the `Cookie` header (as used by Browsers) you can also use the session token (as used by
Mobile) to authenticate a user. To do this you need e.g. to enable inspection within the Expo Go app of your
simulator/emulator and inspect outgoing requests to the GraphQL API after logging in. You should see an `Authentication:
Bearer <some-token-here>` header in the request. This header can also be added within graphiql's UI as an
alternative.

## Continuous Integration and Deployment

### Feature Branches & Environments

When you are working on a story, please create a branch that contains the ticket number in its name, and keep the branch name short. A good default is either only the ticket number (e.g. HOLI-1234) or git flow based names (e.g. feature/HOLI-1234).

When you push this branch, a GitLab CI pipeline is triggered that builds and deploys the code to web (available via <https://$BRANCH_NAME.web.project-holi.org>) and to mobile (available via expo). Also, E2E tests are executed against all platforms.

### Skipping parts of CI

Sometimes, changes don't need to be verified by the full pipeline, e.g. changes in linting or documentation.

#### noenv Branches

When you prefix your branch name with `noenv/` (e.g. `noenv/my-readme-update`) the pipeline only lints & builds, but does not publish, deploy or run e2e test. This saves quite some time. Obviously, many things go untested so only use this if "you know what you're doing".

#### noweb / nomobile Branches

You can also selectively skip the web part of the pipeline by prefixing your branch name with `noweb/`, and the mobile part by prefixing your branch name with `nomobile/`.

### Staging and Production Environments

When a branch is merged to the main branch, the pipeline deploys to the staging environment and runs e2e tests against it. After these are successful, you can manually trigger a deployment of a specific commit to production via GitLab CI.

### Environment variables

Setting environment specific configurations using environment variables works differently for web and mobile: for the web server it is sufficient to provide environment variables during runtime, while for mobile and the web client these variables have to be available at build time, so they are included in the respective bundles. There are also differences between local execution and builds/deployment during CI.

#### Local execution and general usage

For local execution environment variables can usually be provided (both for web and to some extend mobile, see [below](#usage-for-mobile)) by defining the variables in `.envrc` or `.envrc.local` or by passing them directly before issuing a command, e.g. `HOLI_API_URL=foobar yarn web:dev`.

They can be accessed via `process.env` (e.g. `process.env.HOLI_API_URL`).

#### Configuration for web client

For the web client all environment variables that should be available in the browser, have to be provided at build time. To decide which environment variables are included, Next.js requires these to be prefixed with `NEXT_PUBLIC_` (see [documentation](https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser)). (An example for this is the `NEXT_PUBLIC_ENVIRONMENT_ID` that is used for sentry, see `apps/web/environment.ts`).

There also is [runtime configuration](https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration) available in Next.js but we have not yet decided on a solution yet (see [HOLI-1692](https://holi.atlassian.net/browse/HOLI-1692)).

#### Configuration for web deployment

For web deployment it is necessary to include environment variables in the terraform configuration: see `terraform/environments/web/vars.tf` for definitions of variables and `terraform/environments/web/deployment.tf` on how to pass them to the container. You can only use information available at script execution time to provide or calculate the configuration values.

You could also define environment variables in the Dockerfile itself (`apps/web/Dockerfile`), but these may not be environment specific, as the same docker image is used for different environments.

#### Usage for mobile

On mobile builds, environment variables are evaluated at build time and the values are therefore included in the binary as constants. We use [`expo-constants`](https://docs.expo.dev/versions/latest/sdk/constants/) for this, which provides configuration values defined in `apps/mobile/app.config.js` (here environment variables can be used) as constants to the apps, which can be accessed as follows:

```ts
import Constants from 'expo-constants'

export const holiApiUrl = Constants.manifest?.extra?.holi_api.url
```

#### Configuration for mobile builds

For app builds generated using the [`EAS command line tool`](https://github.com/expo/eas-cli) (which is used in the pipelines), environment variables have be set for each build profile in `apps/mobile/eas.json` (see [documentation](https://docs.expo.dev/build/eas-json/#environment-variables)).
You should see such variables listed as `Project environment variables` in the EAS build logs (you should also be able to find the full `app.config.js` there to check that all configuration values are filled in correctly).

## sentry.io logging/tracing

For staging and production deployments, we are reporting logs and errors to sentry.io. Among others, we have a project for [mobile](https://sentry.io/organizations/holistic-foundation/issues/?project=6377191) and another one for [web](https://sentry.io/organizations/holistic-foundation/issues/?project=6396737). Check them out from time to time.

## Accessibility testing

In order to test the output of screen readers on the different platforms, you can use the following tools

- [Screen reader](https://chrome.google.com/webstore/detail/screen-reader/kgejglhpjiefppelpmljglcjbhoiplfn) on web (Chrome)
- [TalkBack / Android Accessibility Suite](https://play.google.com/store/apps/details?id=com.google.android.marvin.talkback) on Android
  - [Installation on emulators](https://holi.atlassian.net/wiki/spaces/HOLI/pages/167280654/Screenreader+Support#Setup-TalkBack-on-an-Android-emulator)
- [VoiceOver](https://support.apple.com/en-us/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios) on iOS
- [Accessibility Inspector](https://developer.apple.com/library/archive/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html) (preinstalled on MacOS): It let's you inspect and e.g. read out loud all accessibilty props on all applications, including our application running within the iOS simulator
