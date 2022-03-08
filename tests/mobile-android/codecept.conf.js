exports.config = {
  tests: './*.js',
  output: './output',
  helpers: {
    Appium: {
      app: '/home/ole/projects/holi/holi-react-native-setup/mobile/app.apk',
      platform: 'Android',
      device: 'emulator',
      /*      desiredCapabilities: {
        automationName: 'Espresso',
        platformVersion: '12',
        deviceName: 'Android Emulator',
      },*/
    },
  },
  include: {
    I: './steps_file.js',
  },
  bootstrap: null,
  mocha: {},
  name: 'mobile',
}
