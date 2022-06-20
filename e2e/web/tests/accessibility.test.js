Feature('Accessibility Test')

Scenario('Playwright web page accessibility test', async ({ I }) => {
  I.amOnPage('/')
  // manual region test
  // (original axe region test is commented, because we cannot structure html like required)
  // https://dequeuniversity.com/rules/axe/4.4/region
  I.waitForElement('nav')
  I.waitForElement('header')
  I.waitForElement('main')
  I.waitForElement('h1')
  I.checkAccessibility()

  // go to volunteering app
  I.clickOnElementWithTestId('profile-button')
  // manual region test
  I.waitForElement('nav')
  I.waitForElement('header')
  I.waitForElement('main')
  I.waitForElement('h1')
  I.checkAccessibility()

  // and go back home
  I.clickOnElementWithTestId('nav-button-home')

  // go to volunteering app
  I.clickOnElementWithTestId('app-tile-volunteering')
  // manual region test
  I.waitForElement('nav')
  I.waitForElement('header')
  I.waitForElement('main')
  I.waitForElement('h1')
  I.checkAccessibility()

  // and go back home
  I.clickOnElementWithTestId('nav-button-home')
})
