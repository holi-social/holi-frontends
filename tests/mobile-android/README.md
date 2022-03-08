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