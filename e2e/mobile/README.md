# Mobile Testing

- [Mobile Testing](#mobile-testing)
  - [Building via EAS](#building-via-eas)
  - [Building Locally (Android)](#building-locally-android)
  - [Local Test Execution](#local-test-execution)
    - [Prerequisites](#prerequisites)
    - [Local Test Execution Against Expo Dev Mode](#local-test-execution-against-expo-dev-mode)
      - [iOS](#ios)
      - [Android](#android)
      - [Single test execution](#single-test-execution)
    - [Local Test Execution Against Binary](#local-test-execution-against-binary)
      - [iOS Simulator](#ios-simulator)
      - [Android Emulator](#android-emulator)
  - [Remote Test Execution on BrowserStack](#remote-test-execution-on-browserstack)
  - [Writing tests](#writing-tests)
    - [Assumptions](#assumptions)
    - [API docs](#api-docs)
  - [Troubleshooting](#troubleshooting)
    - ["browser driver is not running"](#browser-driver-is-not-running)
    - [Can't find simctl SDKs](#cant-find-simctl-sdks)
    - [Espresso server can't be built / started](#espresso-server-cant-be-built--started)
    - [Can't find ANDROID_HOME nor ANDROID_SDK_ROOT](#cant-find-android_home-nor-android_sdk_root)

## Building via EAS

*Note for iOS:* There are two options on how to build an application for iOS: simulator build and archive build. The
former can be used to run your application within a simulator, the latter is used for installation on real devices /
distribution via app stores. Browserstack works on real devices, so archive builds are needed there.

This requires the [EAS command line tool](https://github.com/expo/eas-cli) to be installed.

|Platform       |Yarn Command                   |Alternatively run within `apps/mobile`          |
|---------------|-------------------------------|------------------------------------------------|
|iOS (Simulator)|`yarn mobile:build_ios_sim`    |`eas build --platform ios --profile simulator`  |
|iOS            |`yarn mobile:build_ios`        |`eas build --platform ios`                      |
|Android        |`yarn mobile:build_android`    |`eas build --platform android`                  |
|Android (APK)  |`yarn mobile:build_android_apk`|`eas build --platform android --profile preview`|
|Both           |`yarn mobile:build_all`        |`eas build --platform all`                      |

**Alternatively**, you can use application binaries that have already been built by the build pipeline. It produces iOS
and Android artifacts in the stages `mobile_staging_build` and `mobile_production_build`. These can either be downloaded
from [GitLab](https://gitlab.com/holisticfoundation/holi-frontends/-/pipelines) as a build artifact or from the
[Expo Dashboards Build View](https://expo.dev/accounts/holistic-foundation/projects/projectholi/builds).

## Building Locally (Android)

Follow [this tutorial](https://www.robincussol.com/build-standalone-expo-apk-ipa-with-turtle-cli/).

## Local Test Execution

### Prerequisites

You need to install [Appium](https://appium.io/docs/en/about-appium/getting-started/) in order to run the tests locally.

1. `npm i -g appium appium-doctor`
2. run `appium-doctor`
  (Then do all the things appium-doctor tells you to do / shows as error.)
  (You can also pass arguments to only check for a specific platform: `--ios` resp. `--android`)

    When appium-doctor is successful, you can run appium:

3. run `appium`

### Local Test Execution Against Expo Dev Mode

Executing the e2e tests locally requires the mobile application to be running on a device and `appium` to be started. We also expect the user to be logged out initially.

For [Android](#android) there is a script that takes care of starting the application and an emulator if necessary.

#### iOS

1. Make sure the application is running on the simulator.
2. run `yarn e2e:ios`
   (The script detects and uses the locally running simulator)

#### Android

1. Configure environment variables `E2E_ANDROID_VIRTUAL_DEVICE_NAME` and `ANDROID_HOME` (see `.envrc.local.template`, maybe `ANDROID_HOME` is already set up globally)

   You can use an emulator of your own by using its name as value of `E2E_ANDROID_VIRTUAL_DEVICE_NAME` or use an actual device (run `adb devices` to make sure it is properly connected).
2. run `yarn workspace @holi/e2e-mobile prepare:android`

   This script starts and maybe creates an emulator if necessary, runs `appium` and starts the mobile application locally (using the staging backend).

   If the emulator is run for the first time, Expo Go might open some onboarding layer that should be clicked away.

   If the app was running before, maybe close and reopen it (making sure the newest version is used).
3. run `yarn e2e:android`

   This starts the actual test execution.

#### Single test execution

Single tests can be executed by passing an argument with the name of the spec to be executed, e.g.

```sh
yarn e2e:android -t HomeScreen
# resp.
yarn e2e:ios -t HomeScreen
# or even
yarn e2e:android -t 'Login should work with valid credentials'
```

See the documentation of the [Jest CLI](https://jestjs.io/docs/cli#--testnamepatternregex) for more options.

### Local Test Execution Against Binary

#### iOS Simulator

`APP_PATH=/path/to/application.app yarn e2e:ios`

You need to use the simulator build here (i.e. `yarn mobile:build_ios_sim`).

#### Android Emulator

`APP_PATH=/path/to/application.apk yarn e2e:android`

You need to use the APK build here (i.e. `yarn mobile:build_android_apk`).

⚠️ Make sure to uninstall a previously installed version of the app, as it might not be overwritten by Appium.
(You could set `enforceAppInstall: true` in the `appiumConfig.ts`, but this also slows down execution times).

## Remote Test Execution on [BrowserStack](https://www.browserstack.com)

Upload the previously created application bundle via the tooling or the instructions on the
[BrowserStack Dashboard](https://app-automate.browserstack.com/dashboard/v2/get-started#upload-app). Copy and paste the
"app_url" value displayed on the dashboard (or e.g. as returned by `curl`) into the following command:

```sh
export BROWSERSTACK_APP_URL=<yourappurl>
export BROWSERSTACK_USERNAME=<yourusername>
export BROWSERSTACK_ACCESS_KEY=<youraccesskey>

export APPIUM_TARGET='browserstack' # optional, as this is the default setting
export APPIUM_PLATFORM='ios' # or 'android'

yarn workspace @holi/e2e-mobile run jest --runInBand
```

or alternatively in a single line (in this e2e/mobile directory):

```sh
BROWSERSTACK_USERNAME=<yourusername> BROWSERSTACK_ACCESS_KEY=<youraccesskey> BROWSERSTACK_APP_URL=<yourappurl> APPIUM_PLATFORM=<yourplatform> yarn run jest --runInBand
```

Alternatively, add your Browserstack credentials to `.envrc.local` and have them automatically exported via `direnv`.

If you feel like automating this process by writing a script, take a look at `.gitlab-ci-mobile.yml`.

## Writing tests

### Assumptions

As it is not as easy to instantly navigate to a specific screen on mobile devices as it is on web using URLs, we expect every test to be started on the home screen. When testing using a specific binary (e.g. during CI), this is ensured by starting the app anew before each test. When running the tests locally against the Expo Dev Mode, we keep the same app instance running all the time and make sure to navigate back to the home screen before each test using the helper function `navigateBackToHomeScreen` (defined in `e2e/mobile/helpers/navigation.ts`) during setup (`e2e/mobile/jest.setup.ts`).

We also assume the user to be logged out initially.

### API docs

As we use [WebdriverIO](https://webdriver.io/) as Node.JS client for Appium, see the [webdriver.io API docs](https://webdriver.io/docs/api) for available commands as well as [Appium specific commands](https://webdriver.io/docs/api/appium).
You can also take a look into the [Appium API docs](https://appium.io/docs/en/about-appium/api/) - keep in mind that we are using `webdriver.io` instead of `wd` and we are using the `UiAutomator2` driver for Android and `XCUITest` for iOS.

There already are some helper functions, e.g. to locate and interact with elements or to perform a login with the e2e user, which you can find in the `e2e/mobile/helpers` directory.

## Troubleshooting

### "browser driver is not running"

When running the tests, if you see an error message along the lines of

> Unable to connect to "127.0.0.1:4444", make sure browser driver is running on that address.

it might be necessary to manually run the `appium` process in a separate terminal session, via:

```sh
npm install -g appium
appium
```

### Can't find simctl SDKs

If you see an error like the following for an iOS simulator:

```sh
Original error: '15.4' does not exist in the list of simctl SDKs. Only the following Simulator SDK versions are available on your system: x.y
```

you can either install the required version or set the environment variable `IOS_PLATFORM_VERSION` to the version you have installed (see [Appium troubleshooting](https://github.com/appium/appium/tree/1.x/sample-code/javascript-webdriverio#troubleshooting)).

### Espresso server can't be built / started

I had trouble that the Espresso server could not be built on AdoptOpenJDK16 on macOS. Changing my java version to SDK 11
as was [hinted here](https://github.com/exercism/support/issues/73#issuecomment-538498370) helped.

In order to debug what's going on, watch the output of the appium process and use the `showGradleLog: true` capability for the android emulator in `appiumConfig.ts`.

### Can't find ANDROID_HOME nor ANDROID_SDK_ROOT

If you see the following error even though `appium-doctor` says that `ANDROID_HOME` is set

```sh
Neither ANDROID_HOME nor ANDROID_SDK_ROOT environment variable was exported. Read https://developer.android.com/studio/command-line/variables for more details
Please make sure Selenium Server is running and accessible
```

you might need to add Androids `tools` and `platform-tools` to `PATH`, too:

```sh
export ANDROID_HOME=/home/$(whoami)/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
```
