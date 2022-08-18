import * as webdriverio from 'webdriverio'

import appiumConfig, { waitingTimeout } from './appiumConfig'
import { navigateBackToHomeScreen, waitForHomeScreen } from './helpers/navigation'

global.platform = appiumConfig.platform

beforeEach(async () => {
  global.Appium = await webdriverio.remote(appiumConfig)
  if (appiumConfig.capabilities.app) {
    let appRunning = false
    while (!appRunning) {
      // Wait for the app to start
      try {
        await waitForHomeScreen(2000)
        appRunning = true
      } catch (e) {
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
