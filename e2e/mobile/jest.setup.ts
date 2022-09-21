import * as webdriverio from 'webdriverio'

import appiumConfig, { target } from './appiumConfig'
import { logout } from './helpers/auth'
import { navigateBackToHomeScreen, waitForHomeScreen } from './helpers/navigation'

global.platform = appiumConfig.platform

beforeEach(async () => {
  appiumConfig.capabilities.name = expect.getState().currentTestName
  console.debug('running e2e tests with config', appiumConfig)
  global.Appium = await webdriverio.remote(appiumConfig)
  if (appiumConfig.capabilities.app) {
    let numAttempts = 5
    let appRunning = false
    // Installing and starting the app on local emulator might take very long
    const homeScreenTimeout = target === 'local' ? 60000 : 4000
    while (!appRunning && numAttempts) {
      // Wait for the app to start
      try {
        await waitForHomeScreen(homeScreenTimeout)
        appRunning = true
      } catch (e) {
        numAttempts--
        console.debug('app not fully running yet')
      }
    }
  } else {
    // Logout + navigate back to the home screen before each test
    await logout()
    await navigateBackToHomeScreen()
  }
  // https://appium.io/docs/en/commands/session/timeouts/implicit-wait/
  await global.Appium.setImplicitTimeout(10000)
}, 60000)

jest.setTimeout(120000)

afterEach(async () => {
  await global.Appium?.deleteSession()
})
