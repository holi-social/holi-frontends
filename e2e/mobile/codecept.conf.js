require('ts-node/register')

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

//////////////////////////////////////////
// remote testing on BrowserStack cloud //
//////////////////////////////////////////

// see https://www.browserstack.com/list-of-browsers-and-platforms/app_automate for list of available real devices
const google_pixel_5_11 = { device: 'Google Pixel 5', os: 'android', os_version: '11.0' }
const iphone_xs_13 = { device: 'iPhone XS', os: 'ios', os_version: '13' }

const browserStackDevice = platform === 'android' ? google_pixel_5_11 : iphone_xs_13

const browserStackCapabilities = () => ({
  app: requireEnvVar('BROWSERSTACK_APP_URL'),
  user: requireEnvVar('BROWSERSTACK_USERNAME'),
  key: requireEnvVar('BROWSERSTACK_ACCESS_KEY'),
  host: 'hub-cloud.browserstack.com',
  port: 4444,
  platform: platform,
  ...browserStackDevice,
})

//////////////////////////////////////
// local emulator/simulator testing //
//////////////////////////////////////

// see https://appium.io/docs/en/writing-running-appium/caps/#android
const localAndroidEmulator = {
  platform: 'Android',
  device: 'emulator',
  desiredCapabilities: {
    automationName: 'UiAutomator2',
    // automationName: 'Espresso',
    // https://github.com/appium/appium-espresso-driver/issues/639
    /*espressoBuildConfig: JSON.stringify({
      additionalAppDependencies: ['androidx.lifecycle:lifecycle-extensions:2.2.0'],
    }),*/
    // platformVersion: '12',
    deviceName: 'Android Emulator',
    showGradleLog: true,
  },
}

// see https://appium.io/docs/en/writing-running-appium/caps/#ios-only
// see https://github.com/appium/appium-xcuitest-driver#desired-capabilities
const localIOSSimulator = {
  platform: 'ios',
  device: 'simulator',
  desiredCapabilities: {
    automationName: 'XCUITest',
    // platformVersion: '15.4',
    // deviceName: 'iPhone XS',
    udid: '1FB640B2-C94D-4F8E-93B2-41D6D20E0FF1', // get it with `xcrun simctl list | grep Booted`
    //bundleId: 'foundation.holistic.projectholi',
    showIOSLog: true,
  },
}

const localCapabilities = () => ({
  ...(platform === 'android' ? localAndroidEmulator : localIOSSimulator),
  desiredCapabilities: {
    // if CODECEPT_APP_PATH is not given, codecept expects application to be running on emulator / simulator
    // if CODECEPT_APP_PATH is given, codecept will install application before running the test
    app: process.env.CODECEPT_APP_PATH || undefined,
    //appPackage: process.env.CODECEPT_APP_PATH ? undefined : 'foundation.holistic.projectholi',
    ...(platform === 'android' ? localAndroidEmulator : localIOSSimulator).desiredCapabilities,
  },
})

const appiumConfig = target === 'local' ? localCapabilities() : browserStackCapabilities()

console.info('Starting codecept via Appium with config=', appiumConfig)

exports.config = {
  tests: './**/*.test.ts',
  output: './output',
  helpers: {
    Appium: appiumConfig,
    SelectorHelper: {
      require: './helpers/SelectorHelper.ts',
    },
    LoginHelper: {
      require: './helpers/LoginHelper.ts',
    },
    NavigationHelper: {
      require: './helpers/NavigationHelper.ts',
    },
  },
  include: {
    I: './stepsFile.ts',
  },
  bootstrap: null,
  mocha: {},
  name: 'mobile',
}
