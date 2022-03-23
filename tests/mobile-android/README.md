# Mobile Testing

This spike uses codeceptjs as a high-level wrapper framework for mobile and web testing.

## Appium

In order to test mobile, we can use appium. I generally followed this manual:

https://codecept.io/mobile/#setting-up

The short manual is roughly (not replayed):

  npm i -g appium-doctor
  appium-doctor

Then do all the things appium-doctor tells you to do / shows as error.

Then you can run

  appium

on a shell and leave it running.

Don't forget to

  yarn install

in this directory.

Now, you need to

### Build the APK

Following https://www.robincussol.com/build-standalone-expo-apk-ipa-with-turtle-cli/

Then, add the correct absolute path to the built APK to `codecept.conf.js`

Now, start your emulator. You can then run the test:

  npx codeceptjs run --steps
  
### Issues

#### browser driver is not running

When running codecept, if you see an error message along the lines of

> Unable to connect to "127.0.0.1:4444", make sure browser driver is running on that address.

it might be necessary to manually run the `appium` process in a separate terminal session, via:

```
npm install -g appium
apium
```

#### no matching android version adb available

Make sure that you have set up an Android Virtual Device (AVD) with an Android version that matches the one configured
in `codecept.conf.js`.

#### espresso server can't be built / started

I had trouble that the Espresso server would not be built on AdoptOpenJDK16 on macOS. Changing my java version to SDK 11
as was [hinted here](https://github.com/exercism/support/issues/73#issuecomment-538498370) helped. 

In order to debug what's going on, watch the output of the appium process and use the `showGradleLog: true` capability
in `codecept.conf.js`.