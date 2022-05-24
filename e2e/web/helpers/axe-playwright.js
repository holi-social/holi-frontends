const Helper = require('@codeceptjs/helper')
const { checkA11y, injectAxe } = require('axe-playwright')

class AccessibilityHelper extends Helper {
  // before/after hooks
  _before() {}
  _after() {}

  async checkAccessibility() {
    // console.log('*************** process.env', process.env)
    const { page } = this.helpers['Playwright']
    // const pageUrl = await page.url()

    await injectAxe(page)
    await checkA11y(page)
  }
}

module.exports = AccessibilityHelper
