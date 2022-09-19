import { Options } from '@wdio/types'

const requireEnvVar = (varName: string, options?: { validValues?: Array<string>; defaultValue?: string }) => {
  if (!process.env[varName]) {
    if (!options?.defaultValue) {
      if (options?.validValues) {
        throw Error(`${varName} is not set (valid values: ${options.validValues})`)
      } else {
        throw Error(`${varName} is not set`)
      }
    } else {
      console.info(`${varName} not set, using default value '${options.defaultValue}'`)
      return options.defaultValue
    }
  }
  if (options?.validValues && !options.validValues.includes(process.env[varName] || '')) {
    throw Error(`'${process.env[varName]}' is not a valid value for ${varName} (valid values: ${options.validValues})`)
  }
  return process.env[varName]
}

export const target = requireEnvVar('APPIUM_TARGET', {
  validValues: ['local', 'browserstack'],
  defaultValue: 'browserstack',
})
const platform = requireEnvVar('APPIUM_PLATFORM', { validValues: ['android', 'ios'] })
const platformName = platform === 'android' ? 'Android' : 'iOS'
const appId = 'foundation.holistic.projectholi'
export const waitingTimeout = 5000 // ms

//////////////////////////////////////////
// remote testing on BrowserStack cloud //
//////////////////////////////////////////

// see https://www.browserstack.com/list-of-browsers-and-platforms/app_automate for list of available real devices
const google_pixel_5_11 = { deviceName: 'Google Pixel 5', os: 'android', os_version: '11.0' }
const iphone_xs_13 = { deviceName: 'iPhone XS', os: 'ios', os_version: '13' }

const browserStackDevice = platform === 'android' ? google_pixel_5_11 : iphone_xs_13

const defaultConfig: Partial<Options.WebdriverIO> = {
  logLevel: 'error',
  waitforTimeout: waitingTimeout, // ms
  // TODO (OL) trying if this stabilizes tests
  connectionRetryCount: 3,
  connectionRetryTimeout: 200000, // ms
}

const browserStackCapabilities = () => ({
  ...defaultConfig,
  user: requireEnvVar('BROWSERSTACK_USERNAME'),
  key: requireEnvVar('BROWSERSTACK_ACCESS_KEY'),
  // TODO (OL) trying if this stabilizes tests
  idleTimeout: 120,
  buildName: requireEnvVar('CI_COMMIT_SHA', { defaultValue: 'local' }),
  projectName: 'holi-frontends',
  parallelsPerPlatform: 1,
  networkLogs: true,
  platform,
  capabilities: {
    platformName,
    app: requireEnvVar('BROWSERSTACK_APP_URL'),
    ...browserStackDevice,
  },
})

//////////////////////////////////////
// local emulator/simulator testing //
//////////////////////////////////////

// see https://appium.io/docs/en/writing-running-appium/caps/#android
const localAndroidEmulator = {
  platform: 'Android',
  device: 'emulator',
  capabilities: {
    platformName: 'Android',
    automationName: 'UiAutomator2',
    deviceName: 'Android Emulator',
    appPackage: process.env.APP_PATH ? appId : undefined,
  },
}

// see https://appium.io/docs/en/writing-running-appium/caps/#ios-only
// see https://github.com/appium/appium-xcuitest-driver#desired-capabilities
const localIOSSimulator = () => ({
  platform: 'ios',
  device: 'simulator',
  capabilities: {
    platformName: 'iOS',
    automationName: 'XCUITest',
    platformVersion: process.env.IOS_PLATFORM_VERSION || '15.4',
    deviceName: process.env.IOS_DEVICE_NAME || 'iPhone XS',
    udid: requireEnvVar('LOCAL_IOS_SIMULATOR_UDID'), // get it with `xcrun simctl list | grep Booted`
    //bundleId: process.env.APP_PATH ? appId : undefined,
    showIOSLog: true,
  },
})

const serverConfig: Partial<Options.WebdriverIO> = {
  ...defaultConfig,
  path: '/wd/hub',
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT || '') || 4723,
}

const localCapabilities = () => {
  const platformConfig = platform === 'android' ? localAndroidEmulator : localIOSSimulator()
  return {
    ...platformConfig,
    capabilities: {
      ...platformConfig.capabilities,
      // if APP_PATH is not given, webdriver expects the application to be running on emulator / simulator
      // if APP_PATH is given, webdriver will install the application before running the test
      app: process.env.APP_PATH || undefined,
    },
    ...serverConfig,
  }
}

const appiumConfig = target === 'local' ? localCapabilities() : browserStackCapabilities()

console.debug('running e2e tests with config', appiumConfig)

export default appiumConfig
