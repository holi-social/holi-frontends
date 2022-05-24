Feature('Demo works')

const getCssSelectorForId = (testId) => `[data-testid=${testId}]`

Scenario('open the home screen', ({ I }) => {
  I.amOnPage('/')
  I.waitForText('Hello Anna')
  I.waitForText('Nice to see you here!')
  I.click(getCssSelectorForId('app-tile-community'))
  // I.waitForText('CommunityHome', 10) // menu not yet implemented
  I.click(getCssSelectorForId('communityHomeButton'))
})
