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

  // go to volunteering app
  I.clickOnElementWithTestId('profile-button')
  I.checkAccessibility()
  // manual region test
  I.waitForElement('nav')
  I.waitForElement('header')
  I.waitForElement('main')
  I.waitForElement('h1')

  // and go back home
  I.clickOnElementWithTestId('nav-button-home')

  // go to volunteering app
  I.clickOnElementWithTestId('app-tile-volunteering')
  I.checkAccessibility()
  // manual region test
  I.waitForElement('nav')
  I.waitForElement('header')
  I.waitForElement('main')
  I.waitForElement('h1')

  // and go back home
  I.clickOnElementWithTestId('nav-button-home')
})
