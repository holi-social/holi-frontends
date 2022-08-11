import Helper from '@codeceptjs/helper'

const byTestId = (testID: string, platform: string) => (platform === 'ios' ? `~${testID}` : `#${testID}`)

/**
 * Codecepts Appium Helper
 * https://github.com/codeceptjs/CodeceptJS/blob/master/lib/helper/Appium.js
 */
class SelectorHelper extends Helper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(config: any) {
    super(config)
  }

  async seeTextWithTestId(expectedText: string, testId: string) {
    const { Appium } = this.helpers
    const elementSelector = byTestId(testId, Appium.platform)

    await Appium.waitForElement(elementSelector)
    await Appium.see(expectedText, elementSelector)
  }

  async tapOnElementWithTestId(testId: string) {
    const { Appium } = this.helpers
    const elementSelector = byTestId(testId, Appium.platform)

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

export = SelectorHelper
