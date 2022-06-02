/**
 * Docu: https://codecept.io/playwright/
 */

Feature('Hello Home')

Scenario('open the home screen', ({ I }) => {
  I.amOnPage('/')
  I.waitForText('Home')
  I.waitForText('This week’s topics are Immigration, Education and Sustainability')
  I.waitForElement('[data-testid=app-tile-volunteering]')
  I.clickOnElementWithTestId('app-tile-volunteering')

  I.waitForText('Volunteering App Home')

  I.clickOnElementWithTestId('nav-button-home')
  I.waitForText('Home')
})
