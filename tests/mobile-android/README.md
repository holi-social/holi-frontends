# Mobile Testing

This spike uses codeceptjs as a high-level wrapper framework for mobile and web testing.

## Build the application bundle

First, you need to get hold of an Android application package (`.aab` or `.apk`)
against which the tests shall be executed.

* **Build via and Download from Expo Application Services (EAS) (preferred/simple):** The build pipeline already produces Android artifacts in the stages `mobile_staging_build` and
  `mobile_production_build`. These can either be downloaded from GitLab as a build artifact or from the
  [Expo Dashboards Build View](https://expo.dev/accounts/holistic-foundation/projects/projectholi/builds).
* **Manually build the APK locally:** Follow [this tutorial](https://www.robincussol.com/build-standalone-expo-apk-ipa-with-turtle-cli/)


## Execute Tests on [BrowserStack](https://www.browserstack.com)

Upload the previously created application bundle via the tooling or the instructions on the
[BrowserStack Dashboard](https://app-automate.browserstack.com/dashboard/v2/get-started#upload-app). Copy and paste the
"app_url" value displayed on the dashboard (or e.g. as returned by `curl`) into the following command: 

```
export BROWSERSTACK_APP_URL=<yourappurl>
export BROWSERSTACK_USERNAME=<yourusername>
export BROWSERSTACK_ACCESS_KEY=<youraccesskey>

export CODECEPT_TARGET='browserstack' # optional, as this is the default setting

npx codeceptjs run --steps
```

## Local Execution

In order to locally test mobile, we can use appium. I generally followed [this manual](https://codecept.io/mobile/#setting-up).

The short manual is roughly (not replayed / reproduced on other machines):

```
npm i -g appium appium-doctor
appium-doctor
```

Then do all the things appium-doctor tells you to do / shows as error.

Then, run `appium` on a shell and leave it running.

In *this* directory, run `yarn install`.

Now, start your Android emulator. Then run the test via

```
export CODECEPT_TARGET='local'
export CODECEPT_APP_PATH=/path/to/your/apk

npx codeceptjs run --steps
```
  
### Troubleshooting

#### "browser driver is not running"

When running codecept, if you see an error message along the lines of

> Unable to connect to "127.0.0.1:4444", make sure browser driver is running on that address.

it might be necessary to manually run the `appium` process in a separate terminal session, via:

```
npm install -g appium
apium
```

#### No Matching Android Version available on Virtual Device

Make sure that you have set up an Android Virtual Device (AVD) with an Android version that matches the one configured
in `codecept.conf.js`.

#### Espresso server can't be built / started

I had trouble that the Espresso server could not be built on AdoptOpenJDK16 on macOS. Changing my java version to SDK 11
as was [hinted here](https://github.com/exercism/support/issues/73#issuecomment-538498370) helped. 

In order to debug what's going on, watch the output of the appium process and use the `showGradleLog: true` capability
in `codecept.conf.js`.