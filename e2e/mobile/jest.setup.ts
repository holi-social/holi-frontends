import appiumConfig from './appiumConfig'
import { navigateBackToHomeScreen } from './helpers/navigation'

// TODO(SF) why is import not working?
// import webdriverio from 'webdriverio'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webdriverio = require('webdriverio')

global.platform = appiumConfig.platform

beforeEach(async () => {
  // TOOD(SF) rename?
  global.Appium = await webdriverio.remote(appiumConfig)
  global.Appium.setTimeout(appiumConfig.timeouts)
  await navigateBackToHomeScreen()
}, 30000) // TODO(SF) improve

afterEach(() => {
  global.Appium?.deleteSession()
})
