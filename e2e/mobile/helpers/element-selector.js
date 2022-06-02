const Helper = require('@codeceptjs/helper')

const testID = (testID, I) => {
  // I.runOnIOS()
  return { android: `//*[@view-tag="${testID}"]`, ios: `~${testID}` }
}

class SelectorHelper extends Helper {
  async tabOnElementWithTestId(testId) {
    // I.runOnIOS(() => { })
    // I.runOnAndroid(() => { })

    const { Appium } = this.helpers
    // const elementSelector = selectorByTestId(testId)
  }
  // async clickOnElementWithTestId(testId) {
  //   const {  } = this.helpers
  //   const elementSelector = selectorByTestId(testId)
  //   const els = await Playwright._locate(elementSelector)
  //   if (!els || !els[0]) throw new Error(`[e2e web: SelectorHelper] Could not find element with selector "${elementSelector}"`)
  //   // for (let el of els) {
  //   //   await el.click()
  //   // }
  //   await els[0].click()
  // }
}

module.exports = SelectorHelper
