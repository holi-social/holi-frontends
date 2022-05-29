Feature('Demo works')

const getCssSelectorForId = (testId) => `[data-testid=${testId}]`

Scenario('open the home screen', ({ I }) => {
  I.amOnPage('/')
  I.waitForText('Home')
  I.waitForText('This week’s topics are Immigration, Education and Sustainability')
  I.click(getCssSelectorForId('app-tile-volunteering'))
  // I.waitForText('CommunityHome', 10) // menu not yet implemented
  I.waitForText('Volunteering App Home')
  I.click(getCssSelectorForId('nav-button-home'))
})
