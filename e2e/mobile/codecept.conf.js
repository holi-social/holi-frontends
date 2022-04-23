const requireEnvVar = (varName, validValues, defaultValue) => {
  if (!process.env[varName]) {
    if (!defaultValue) {
      if (validValues) {
        throw Error(`${varName} is not set (valid values: ${validValues})`)
      } else {
        throw Error(`${varName} is not set`)
      }
    } else {
      console.info(`${varName} not set, using default value '${defaultValue}'`)
      return defaultValue
    }
  }
  if (validValues && !validValues.includes(process.env[varName])) {
    throw Error(`'${process.env[varName]}' is not a valid value for ${varName} (valid values: ${validValues})`)
  }
  return process.env[varName]
}

const target = requireEnvVar('CODECEPT_TARGET', ['local', 'browserstack'], 'browserstack')
const platform = requireEnvVar('CODECEPT_PLATFORM', ['android', 'ios'])

// see https://www.browserstack.com/list-of-browsers-and-platforms/app_automate for list of available real devices
const google_pixel_5_11 = { device: 'Google Pixel 5', os: 'android', os_version: '11.0' }
const iphone_xs_13 = { device: 'iPhone XS', os: 'ios', os_version: '13' }

const browserStackDevice = platform === 'android' ? google_pixel_5_11 : iphone_xs_13

const browserStackCapabilities = () => ({
  app: requireEnvVar('BROWSERSTACK_APP_URL'),
  host: 'hub-cloud.browserstack.com',
  user: requireEnvVar('BROWSERSTACK_USERNAME'),
  key: requireEnvVar('BROWSERSTACK_ACCESS_KEY'),
  port: 4444,
  platform,
  ...browserStackDevice,
})

const localEmulatorAndroidCapabilities = () => ({
  app: requireEnvVar('CODECEPT_APP_PATH'),
  platform: 'Android',
  device: 'emulator',
  desiredCapabilities: {
    // automationName: 'Espresso',
    platformVersion: '11',
    deviceName: 'Android Emulator',
    showGradleLog: true,
  },
})

const appiumConfig = target === 'local' ? localEmulatorAndroidCapabilities() : browserStackCapabilities()

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
