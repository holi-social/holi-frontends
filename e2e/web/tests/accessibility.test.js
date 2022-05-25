Feature('Accessibility Test')

Scenario('Playwright web page accessibility test', async ({ I }) => {
  I.amOnPage('/')
  I.checkAccessibility()
  // go into community
  I.clickOnElementWithTestId('app-tile-community')
  I.checkAccessibility()
  // and go back home
  I.clickOnElementWithTestId('communityHomeButton')
})
