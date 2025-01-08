import type { Options } from '@wdio/types'
import { execFileSync } from 'child_process'

const requireEnvVar = (varName: string, options?: { validValues?: Array<string>; defaultValue?: string }) => {
  if (!process.env[varName]) {
    if (!(options && 'defaultValue' in options)) {
      if (options?.validValues) {
        throw Error(`${varName} is not set (valid values: ${options.validValues})`)
      } else {
        throw Error(`${varName} is not set`)
      }
    } else {
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
const appId = 'foundation.holistic.projectholi'

//////////////////////////////////////////
// remote testing on BrowserStack cloud //
//////////////////////////////////////////

// see https://www.browserstack.com/list-of-browsers-and-platforms/app_automate for list of available real devices
const android_device = { 'appium:deviceName': 'Google Pixel 6 Pro', 'appium:platformVersion': '13.0' }
const iphone_device = { 'appium:deviceName': 'iPhone 12 Pro', 'appium:platformVersion': '16' }

const browserStackDevice = platform === 'ios' ? iphone_device : android_device

const defaultConfig: Partial<Options.WebdriverIO> = {
  logLevel: 'error',
  // timeout in ms for the waitFor... commands
  waitforTimeout: 10000, // ms
  // TODO (OL) trying if this stabilizes tests
  connectionRetryCount: 1,
  connectionRetryTimeout: 600000, // ms
}

const gitlabBranchName = requireEnvVar('CI_COMMIT_REF_NAME', { defaultValue: undefined })
const gitlabCommmitSHA = requireEnvVar('CI_COMMIT_SHA', { defaultValue: undefined })
const gitlabJobID = requireEnvVar('CI_JOB_ID', { defaultValue: undefined })
// unique across single runs of the pipeline, but still informative
const gitlabCommitSHAAndJobID = gitlabCommmitSHA ? `SHA-${gitlabCommmitSHA}_JOB-${gitlabJobID}` : undefined

const localGitInfo = (() => {
  const git = (parameters: string[]) => {
    return execFileSync('git', parameters)
  }
  return {
    branch: git(['rev-parse', '--abbrev-ref', 'HEAD'])?.toString(),
    sha: git(['rev-parse', 'HEAD'])?.toString(),
  }
})()

const browserStackCapabilities = () => {
  return {
    // WebDriverIO level https://webdriver.io/docs/options/
    ...defaultConfig,
    user: requireEnvVar('BROWSERSTACK_USERNAME'),
    key: requireEnvVar('BROWSERSTACK_ACCESS_KEY'),
    platform,
    capabilities: {
      platformName: platform,
      'appium:automationName': platform === 'ios' ? 'XCUITest' : 'UIAutomator2',
      'appium:automationVersion': 'latest',
      // BrowserStack options builder: https://www.browserstack.com/app-automate/capabilities#
      'appium:app': requireEnvVar('BROWSERSTACK_APP_URL'),
      'appium:settings[snapshotMaxDepth]': 100,
      'appium:autoGrantPermissions': 'true',
      'appium:autoAcceptAlerts': 'true',
      'bstack:options': {
        appiumVersion: '2.0.1',
        projectName: gitlabBranchName || localGitInfo.branch,
        buildName: gitlabCommitSHAAndJobID || `${requireEnvVar('USER')?.toUpperCase()}_SHA${localGitInfo.sha}`,
        sessionName: 'undefined',
        idleTimeout: '60', // seconds, should be short in order to fail early and keep queue slots open
        networkLogs: 'true',
        networkLogsOptions: {
          captureContent: 'true',
        },
        consoleLogs: 'info',
        disableAnimations: 'true',
      },
      ...browserStackDevice,
    },
  }
}

//////////////////////////////////////
// local emulator/simulator testing //
//////////////////////////////////////

// see https://appium.io/docs/en/writing-running-appium/caps/#android
const localAndroidEmulator = () => ({
  platform: 'Android',
  device: 'emulator',
  capabilities: {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android Emulator',
    'appium:appPackage': process.env.APP_PATH ? appId : undefined,
    'appium:autoGrantPermissions': 'true',
  },
})

// see https://appium.io/docs/en/writing-running-appium/caps/#ios-only
// see https://github.com/appium/appium-xcuitest-driver#desired-capabilities
const localIOSSimulator = () => ({
  platform: 'ios',
  device: 'simulator',
  capabilities: {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:platformVersion': process.env.IOS_PLATFORM_VERSION || '15.4',
    'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone XS',
    'appium:udid': requireEnvVar('LOCAL_IOS_SIMULATOR_UDID'), // get it with `xcrun simctl list | grep Booted`
    //bundleId: process.env.APP_PATH ? appId : undefined,
    'appium:showIOSLog': false,
    'appium:settings[snapshotMaxDepth]': 100,
    'appium:autoAcceptAlerts': true,
    'appium:showXcodeLog': false,
  },
})

const serverConfig: Partial<Options.WebdriverIO> = {
  ...defaultConfig,
  // @ts-ignore host ist correct, even though the webdriver.io type has hostname
  host: process.env.APPIUM_HOST || 'localhost',
  port: Number.parseInt(process.env.APPIUM_PORT || '') || 4723,
  path: process.env.APPIUM_PATH || '/',
}

const localCapabilities = () => {
  const platformConfig = platform === 'ios' ? localIOSSimulator() : localAndroidEmulator()
  return {
    ...platformConfig,
    capabilities: {
      ...platformConfig.capabilities,
      // if APP_PATH is not given, webdriver expects the application to be running on emulator / simulator
      // if APP_PATH is given, webdriver will install the application before running the test
      'appium:app': process.env.APP_PATH || undefined,
    },
    ...serverConfig,
  }
}

const appiumConfig = target === 'local' ? localCapabilities() : browserStackCapabilities()

export default appiumConfig
