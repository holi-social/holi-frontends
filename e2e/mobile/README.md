# Mobile Testing

- [Mobile Testing](#mobile-testing)
  - [Building via EAS](#building-via-eas)
  - [Building Locally (Android)](#building-locally-android)
  - [Local Test Execution](#local-test-execution)
    - [Prerequisites](#prerequisites)
    - [Local Test Execution Against Expo Dev Mode](#local-test-execution-against-expo-dev-mode)
    - [Local Test Execution Against Binary](#local-test-execution-against-binary)
      - [iOS Simulator](#ios-simulator)
      - [Android Emulator](#android-emulator)
  - [Remote Test Execution on BrowserStack](#remote-test-execution-on-browserstack)
  - [Troubleshooting](#troubleshooting)
    - ["browser driver is not running"](#browser-driver-is-not-running)
    - [No Matching Android Version available on Virtual Device](#no-matching-android-version-available-on-virtual-device)
    - [Espresso server can't be built / started](#espresso-server-cant-be-built--started)
    - [Can't find ANDROID_HOME nor ANDROID_SDK_ROOT](#cant-find-android_home-nor-android_sdk_root)

## Building via EAS

*Note for iOS:* There are two options on how to build an application for iOS: simulator build and archive build. The
former can be used to run your application within a simulator, the latter is used for installation on real devices /
distribution via app stores. Browserstack works on real devices, so archive builds are needed there.

|Platform       |Yarn Command               |Alternatively run within `apps/mobile`        |
|---------------|---------------------------|----------------------------------------------|
|iOS (Simulator)|`yarn mobile:build_ios_sim`|`eas build --platform ios --profile simulator`|
|iOS            |`yarn mobile:build_ios`    |`eas build --platform ios`                    |
|Android        |`yarn mobile:build_android`|`eas build --platform android`                |
|Both           |`yarn mobile:build_all`    |`eas build --platform all`                    |

**Alternatively**, you can use application binaries that have already been built by the build pipeline. It produces iOS
and Android artifacts in the stages `mobile_staging_build` and `mobile_production_build`. These can either be downloaded
from [GitLab](https://gitlab.com/holisticfoundation/holi-react-native-setup/-/pipelines) as a build artifact or from the
[Expo Dashboards Build View](https://expo.dev/accounts/holistic-foundation/projects/projectholi/builds).

## Building Locally (Android)

Follow [this tutorial](https://www.robincussol.com/build-standalone-expo-apk-ipa-with-turtle-cli/).

## Local Test Execution

### Prerequisites

The short manual is roughly (not replayed / reproduced on other machines):

1. `npm i -g appium appium-doctor`
2. run `appium-doctor`
  (Then do all the things appium-doctor tells you to do / shows as error.)

    When appium-doctor is successful, run appium:

3. run `appium`


### Local Test Execution Against Expo Dev Mode

1. Make sure the application is running and on the "home screen" (i.e. where it goes right after start)
3. (iOs) grab simulator Id with this command (in new tab):

    `xcrun simctl list | grep Booted`

    and add field `udid` to file `e2e/mobile/codecept.conf.js`
4. run `yarn run mobile:e2e:ios`
5. run `yarn run mobile:e2e:android`

Find more docu [here](https://codecept.io/mobile/#setting-up)

### Local Test Execution Against Binary

#### iOS Simulator

`CODECEPT_TARGET=local CODECEPT_PLATFORM=ios CODECEPT_APP_PATH=/path/to/application.app yarn codeceptjs`. You
need to use the simulator build here.

#### Android Emulator

`CODECEPT_TARGET=local CODECEPT_PLATFORM=android CODECEPT_APP_PATH=/path/to/application.app yarn codeceptjs`

## Remote Test Execution on [BrowserStack](https://www.browserstack.com)

Upload the previously created application bundle via the tooling or the instructions on the
[BrowserStack Dashboard](https://app-automate.browserstack.com/dashboard/v2/get-started#upload-app). Copy and paste the
"app_url" value displayed on the dashboard (or e.g. as returned by `curl`) into the following command:

```
export BROWSERSTACK_APP_URL=<yourappurl>
export BROWSERSTACK_USERNAME=<yourusername>
export BROWSERSTACK_ACCESS_KEY=<youraccesskey>

export CODECEPT_TARGET='browserstack' # optional, as this is the default setting
export CODECEPT_PLATFORM='ios' # or 'android'

yarn codeceptjs
```

Alternatively, add your Browserstack credentials to `.envrc.local` and have them automatically exported via `direnv`
when cd'ing into `e2e/mobile`.

If you feel like automating this process by writing a script, take a look at `.gitlab-ci.yml`.

## Troubleshooting

### "browser driver is not running"

When running codecept, if you see an error message along the lines of

> Unable to connect to "127.0.0.1:4444", make sure browser driver is running on that address.

it might be necessary to manually run the `appium` process in a separate terminal session, via:

```
npm install -g appium
apium
```

### No Matching Android Version available on Virtual Device

Make sure that you have set up an Android Virtual Device (AVD) with an Android version that matches the one configured
in `codecept.conf.js`.

### Espresso server can't be built / started

I had trouble that the Espresso server could not be built on AdoptOpenJDK16 on macOS. Changing my java version to SDK 11
as was [hinted here](https://github.com/exercism/support/issues/73#issuecomment-538498370) helped.

In order to debug what's going on, watch the output of the appium process and use the `showGradleLog: true` capability
in `codecept.conf.js`.

### Can't find ANDROID_HOME nor ANDROID_SDK_ROOT

If you see the following error even though `appium-doctor` says that `ANDROID_HOME` is set

```
Neither ANDROID_HOME nor ANDROID_SDK_ROOT environment variable was exported. Read https://developer.android.com/studio/command-line/variables for more details
Please make sure Selenium Server is running and accessible
```

you might need to add Androids `tools` and `platform-tools` to `PATH`, too:

```
export ANDROID_HOME=/home/$(whoami)/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
```
