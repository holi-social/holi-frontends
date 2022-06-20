Feature('Accessibility Test')

Scenario('Playwright web page accessibility test', async ({ I }) => {
  I.amOnPage('/')
  I.waitForElement('h1')
  I.checkAccessibility()

  // go to volunteering app
  I.clickOnElementWithTestId('profile-button')
  I.waitForElement('h1')
  I.checkAccessibility()

  // and go back home
  I.clickOnElementWithTestId('nav-button-home')

  // go to volunteering app
  I.clickOnElementWithTestId('app-tile-volunteering')
  I.waitForElement('h1')
  I.checkAccessibility()

  // and go back home
  I.clickOnElementWithTestId('nav-button-home')
})
