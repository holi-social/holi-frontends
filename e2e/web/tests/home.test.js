/**
 * Docu: https://codecept.io/playwright/
 */

Feature('Hello Home')

Scenario('open the home screen', ({ I }) => {
  I.amOnPage('/')
  I.waitForText('Hello Anna')
  I.waitForText('Nice to see you here!')
  I.waitForElement('[data-testid=app-tile-community]')
  I.clickOnElementWithTestId('app-tile-community')
  // I.waitForText('CommunityHome', 10) // menu not yet implemented in web
  I.waitForElement('[data-testid=communityHomeButton]')
  I.clickOnElementWithTestId('communityHomeButton')
  I.waitForText('Hello Anna')
})
