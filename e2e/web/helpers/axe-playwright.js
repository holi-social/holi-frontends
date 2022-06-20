/**
 * Axes rules list: https://dequeuniversity.com/rules/axe/4.4
 * Rule descriptions: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
 */

const Helper = require('@codeceptjs/helper')
const { checkA11y, injectAxe } = require('axe-playwright')

class AccessibilityHelper extends Helper {
  // before/after hooks
  _before() {}
  _after() {}

  async checkAccessibility() {
    const { page } = this.helpers['Playwright']

    await injectAxe(page)

    const options = {
      rules: {
        region: { enabled: true }, // https://dequeuniversity.com/rules/axe/4.4/region
      },
    }
    await checkA11y(page, options)
  }
}

module.exports = AccessibilityHelper
