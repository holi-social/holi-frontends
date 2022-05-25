const Helper = require('@codeceptjs/helper')

const selectorByTestId = (testId) => `[data-testid=${testId}]`

class SelectorHelper extends Helper {
  async clickOnElementWithTestId(testId) {
    const { Playwright } = this.helpers
    const els = await Playwright._locate(selectorByTestId(testId))
    // for (let el of els) {
    //   await el.click()
    // }
    await els[0].click()
  }
}

module.exports = SelectorHelper
