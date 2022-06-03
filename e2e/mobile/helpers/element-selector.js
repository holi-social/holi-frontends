const Helper = require('@codeceptjs/helper')

const selectorByTestId = (testID, platform) => (platform === 'ios' ? `~${testID}` : `#${testID}`)

/**
 * Codecepts Appium Helper
 * https://github.com/codeceptjs/CodeceptJS/blob/18f9fd5f356396c94a7aeb040a03ec92340849a7/lib/helper/Appium.js
 */
class SelectorHelper extends Helper {
  async tapOnElementWithTestId(testId) {
    const { Appium } = this.helpers
    const elementSelector = selectorByTestId(testId, Appium.platform)

    await Appium.waitForElement(elementSelector)
    await Appium.tap(elementSelector)

    // ios with native Appium functions:
    // const browser = Appium.browser
    // const ele = await browser.$(elementSelector) // https://webdriver.io/docs/api/browser/$/
    // if (ele.error)
    //   throw new Error(`[e2e mobile: SelectorHelper] Could not find element with selector "${elementSelector}"`)
    // await ele.touchAction('tap')
  }
}

module.exports = SelectorHelper
