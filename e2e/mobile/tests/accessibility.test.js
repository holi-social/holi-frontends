Feature('Accessibility Test')

Scenario('Axe mobile app accessibility test', async ({ I }) => {
  I.checkAccessibility()

  // go to profile view
  // I.clickOnElementWithTestId('profile-button')
  // I.checkAccessibility()

  // // and go back home
  // I.clickOnElementWithTestId('nav-button-home')

  // // go to volunteering app
  // I.clickOnElementWithTestId('app-tile-volunteering')
  // I.checkAccessibility()

  // // and go back home
  // I.clickOnElementWithTestId('nav-button-home')
})
