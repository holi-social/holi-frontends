import * as webdriverio from 'webdriverio'

import appiumConfig, { target as appiumConfigTarget } from './appiumConfig'
import { PlatformType, TargetType } from './global'
import { logout } from './helpers/auth'
import { waitForHomeScreen } from './helpers/navigation'
import { resetImplicitTimeout, tapOnElementWithTestId, waitForElementWithTestId } from './helpers/selectors'

platform = appiumConfig.platform as PlatformType
target = appiumConfigTarget as TargetType

beforeEach(
  async () => {
    // make test name visible in BrowserStack
    if (target === 'browserstack') {
      // @ts-ignore custom capabilities are not covered by the type
      appiumConfig.capabilities['bstack:options'].sessionName = expect.getState().currentTestName
    }
    // @ts-ignore custom capabilities are not covered by the type
    Appium = await webdriverio.remote(appiumConfig)

    // https://appium.io/docs/en/commands/session/timeouts/implicit-wait/
    await resetImplicitTimeout()

    // @ts-ignore custom capabilities are not covered by the type
    if (appiumConfig.capabilities['appium:app']) {
      let numAttempts = 5
      let appRunning = false
      // Installing and starting the app on local emulator might take very long
      // expo app starts quickly, but it takes some time in the expo splash screen until our app is fully functional, therefore we poll wait here.
      const homeScreenTimeout = target === 'local' ? 60000 : 4000
      while (!appRunning && numAttempts) {
        // Wait for the app to start
        try {
          await waitForElementWithTestId('btn-consentModal-declineAll', homeScreenTimeout)
          appRunning = true
        } catch (e) {
          numAttempts--
        }
      }
      // Decline tracking and skip onboarding
      await tapOnElementWithTestId('btn-consentModal-declineAll')
      await tapOnElementWithTestId('btn-to-onboarding')
      await tapOnElementWithTestId('holi-wizard-skip-btn')
      await waitForHomeScreen(homeScreenTimeout)
    } else {
      // Logout + navigate back to the home screen before each test
      await logout()
    }
  },
  20 * 60 * 1000
) // the timeout here has to be very high. If we end up in the queue, there might be 5 tests before us, each potentially 2 minutes long.

jest.setTimeout(6 * 60 * 1000) // a normal test runs up to 5 minutes, but give some time to spare

afterEach(async () => {
  if (!process.env['APPIUM_TARGET'] || process.env.APPIUM_TARGET === 'browserstack') {
    if (!sessionHolder) sessionHolder = {}
    sessionHolder.id = Appium.sessionId
  }
  await Appium?.deleteSession()
})
