const browserStackCapabilities = {
  'browserstack.user': process.env.BROWSERSTACK_USERNAME,
  'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
  project: 'Project HOLI',
  build: 'holi-build-1', // TODO increment build number (or let system auto-generate?)
  name: 'first_test',
  realMobile: 'false',
  //networkLogs: 'true',
}

const config = {
  tests: './*.js',
  output: './output',
  helpers: {
    Appium: {
      app: process.env.BROWSERSTACK_APP_URL,
      host: 'hub-cloud.browserstack.com',
      user: process.env.BROWSERSTACK_USERNAME,
      key: process.env.BROWSERSTACK_ACCESS_KEY,
      port: 4444,
      platform: 'Android',
      device: 'Google Pixel 5',
      desiredCapabilities: {
        platformVersion: '11.0',
        deviceName: 'Google Pixel 5',
      },
    },
  },
  include: {
    I: './steps_file.js',
  },
  bootstrap: null,
  mocha: {},
  name: 'mobile',
}

console.info(config)

exports.config = config
