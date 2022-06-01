Feature('Accessibility Test')

Scenario('Playwright web page accessibility test', async ({ I }) => {
  I.amOnPage('/')
  I.checkAccessibility()
  // manual region test
  // (original axe region test is commented, because we cannot structure html like required)
  // https://dequeuniversity.com/rules/axe/4.4/region
  I.waitForElement('nav')
  I.waitForElement('header')
  I.waitForElement('main')
  I.waitForElement('h1')

  // go into community
  I.clickOnElementWithTestId('app-tile-community')
  I.checkAccessibility()
  // manual region test
  I.waitForElement('nav')
  I.waitForElement('header')
  I.waitForElement('main')
  I.waitForElement('h1')
  // and go back home
  I.clickOnElementWithTestId('communityHomeButton')
})
