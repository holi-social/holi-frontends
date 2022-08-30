import * as webdriverio from 'webdriverio'

import appiumConfig, { target, waitingTimeout } from './appiumConfig'
import { navigateBackToHomeScreen, waitForHomeScreen } from './helpers/navigation'

global.platform = appiumConfig.platform

beforeEach(async () => {
  global.Appium = await webdriverio.remote(appiumConfig)
  if (appiumConfig.capabilities.app) {
    let numAttempts = 5
    let appRunning = false
    // Installing and starting the app on local emulator might take very long
    const homeScreenTimeout = target === 'local' ? 2000 : 2000
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
    // Navigate back to the home screen before each test
    await navigateBackToHomeScreen()
  }
  // https://appium.io/docs/en/commands/session/timeouts/implicit-wait/
  await global.Appium.setImplicitTimeout(waitingTimeout)
}, 60000)

afterEach(async () => {
  await global.Appium?.deleteSession()
})
