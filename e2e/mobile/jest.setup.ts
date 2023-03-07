import * as webdriverio from 'webdriverio'

import appiumConfig, { target } from './appiumConfig'
import { logout } from './helpers/auth'
import { navigateBackToHomeScreen, waitForHomeScreen } from './helpers/navigation'
import { resetImplicitTimeout, tapOnElementWithTestId, waitForElementWithTestId } from './helpers/selectors'

global.platform = appiumConfig.platform
global.target = target

beforeEach(async () => {
  // make test name visible in BrowserStack
  if (target === 'browserstack') {
    appiumConfig.capabilities['bstack:options'].sessionName = expect.getState().currentTestName
  }
  global.Appium = await webdriverio.remote(appiumConfig)
  // https://appium.io/docs/en/commands/session/timeouts/implicit-wait/
  await resetImplicitTimeout()
  if (appiumConfig.capabilities['appium:app']) {
    let numAttempts = 5
    let appRunning = false
    // Installing and starting the app on local emulator might take very long
    // expo app starts quickly, but it takes some time in the expo splash screen until our app is fully functional, therefore we poll wait here.
    const homeScreenTimeout = target === 'local' ? 60000 : 4000
    while (!appRunning && numAttempts) {
      // Wait for the app to start
      try {
        await waitForElementWithTestId('btn-to-continue-as-guest', homeScreenTimeout)
        appRunning = true
      } catch (e) {
        numAttempts--
      }
    }
    await tapOnElementWithTestId('btn-to-continue-as-guest')
    await waitForHomeScreen(homeScreenTimeout)
  } else {
    // Logout + navigate back to the home screen before each test
    await navigateBackToHomeScreen()
    await logout()
  }
}, 900000) // the timeout here has to be very high. If we end up in the queue, there might be 5 tests before us, each potentially 2 minutes long.

jest.setTimeout(240000) // a normal test runs up to 2 minutes, but give some time to spare

afterEach(async () => {
  if (!process.env['APPIUM_TARGET'] || process.env.APPIUM_TARGET === 'browserstack') {
    if (!global.sessionHolder) global.sessionHolder = {}
    global.sessionHolder.id = Appium.sessionId
  }
  await global.Appium?.deleteSession()
})
