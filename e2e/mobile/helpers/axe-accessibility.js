/**
 * https://dev.to/steady5063/mobile-web-accessibility-testing-using-appium-3ndc
 *
 * "Native mobile developers are rare and expensive. Accessibility-first mobile developers are unicorns"
 * from https://www.deque.com/blog/mobile-developers-must-prioritize-accessibility-to-remain-relevant/
 */

const Helper = require('@codeceptjs/helper')
const AxeWebdriverJS = require('@axe-core/webdriverjs')

class AccessibilityHelper extends Helper {
  async checkAccessibility() {
    const { Appium } = this.helpers
    const driver = Appium.browser

    // https://github.com/dequelabs/axe-core-npm/tree/develop/packages/webdriverio
    const axeDriver = await new AxeWebdriverJS(driver)

    // await driver.get('/')

    // https://github.com/dequelabs/axe-core-npm/blob/master/packages/webdriverjs/src/index.ts#L124
    await axeDriver.analyze()
    const axeResults = await axeDriver.analyze()
    console.log('##### ', axeResults)
    // assert(axeResults.violations.length === 0, "a11y issues found!")

    // causes error as the driver has no function 'switchTo'
    // Appium helper uses webdriverio https://github.com/codeceptjs/CodeceptJS/blob/master/lib/helper/Appium.js#L233
    // but AxeWebdriverJS wants selenium-webdriver
    // Is it only ment for mobile webbrowser ?!
    // https://github.com/Steady5063/appium-axe-example/blob/main/_tests_/abctech.spec.js
  }
}

module.exports = AccessibilityHelper
