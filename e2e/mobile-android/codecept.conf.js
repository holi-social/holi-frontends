const target = process.env.CODECEPT_TARGET || 'browserstack'

const requireEnvVar = (varName) => {
  if (!process.env[varName]) throw Error(`${varName} is not set`)
}

// validate required env vars are set
if (target === 'browserstack') {
  ;['BROWSERSTACK_APP_URL', 'BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY'].forEach(requireEnvVar)
} else if (target === 'local') {
  ;['CODECEPT_APP_PATH'].forEach(requireEnvVar)
}

const browserStackCapabilities = {
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
}

const localEmulatorAndroidCapabilities = {
  app: process.env.CODECEPT_APP_PATH,
  platform: 'Android',
  device: 'emulator',
  desiredCapabilities: {
    // automationName: 'Espresso',
    platformVersion: '11',
    deviceName: 'Android Emulator',
    showGradleLog: true,
  },
}

const appiumConfig = target === 'local' ? localEmulatorAndroidCapabilities : browserStackCapabilities

exports.config = {
  tests: './*.js',
  output: './output',
  helpers: {
    Appium: appiumConfig,
  },
  include: {
    I: './steps_file.js',
  },
  bootstrap: null,
  mocha: {},
  name: 'mobile',
}
