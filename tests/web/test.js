Feature('Demo works')

Scenario('open the home screen', ({ I }) => {
  I.amOnPage('/')
  I.waitForText('Hello Anna')
  I.amOnPage('/community')
})
