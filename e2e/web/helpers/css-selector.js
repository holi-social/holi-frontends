const Helper = require('@codeceptjs/helper')

const selectorByTestId = (testId) => `[data-testid=${testId}]`

class SelectorHelper extends Helper {
  async clickOnElementWithTestId(testId) {
    const { Playwright } = this.helpers
    const elementSelector = selectorByTestId(testId)
    const els = await Playwright._locate(elementSelector)
    if (!els || !els[0]) throw new Error(`[e2e web: SelectorHelper] Could not find element with selector "${elementSelector}"`)
    // for (let el of els) {
    //   await el.click()
    // }
    await els[0].click()
  }
}

module.exports = SelectorHelper
