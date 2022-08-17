import * as webdriverio from 'webdriverio'

import appiumConfig, { timeouts } from './appiumConfig'
import { navigateBackToHomeScreen } from './helpers/navigation'

global.platform = appiumConfig.platform

beforeEach(async () => {
  global.Appium = await webdriverio.remote(appiumConfig)
  // Navigate back to the home screen before each test
  await navigateBackToHomeScreen()
  global.Appium.setTimeout(timeouts)
}, 60000) // TODO(SF) improve, move to jest config?

afterEach(() => {
  global.Appium?.deleteSession()
})
