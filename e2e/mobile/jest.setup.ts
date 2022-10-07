import * as webdriverio from 'webdriverio'

import appiumConfig, { target } from './appiumConfig'
import { logout } from './helpers/auth'
import { navigateBackToHomeScreen, waitForHomeScreen } from './helpers/navigation'

global.platform = appiumConfig.platform

beforeEach(async () => {
  appiumConfig.capabilities.name = expect.getState().currentTestName
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
      }
    }
  } else {
    // Logout + navigate back to the home screen before each test
    await logout()
    await navigateBackToHomeScreen()
  }
  // https://appium.io/docs/en/commands/session/timeouts/implicit-wait/
  await global.Appium.setImplicitTimeout(10000)
}, 900000) // the timeout here has to be very high. If we end up in the queue, there might be 5 tests before us, each potentially 2 minutes long.

jest.setTimeout(240000) // a normal test runs up to 2 minutes, but give some time to spare

afterEach(async () => {
  await global.Appium?.deleteSession()
})
