Feature('Demo works')

Scenario('open the home screen', ({ I }) => {
  I.amOnPage('/')
  I.waitForText('Home')
  I.click('Components')
  I.waitForText('You clicked 0 times')
  // simply selecting by text with brackets in it does not work, so we use xpath here
  I.click('//div[contains(text(),"Click Me (Button component)")]')
  I.waitForText('You clicked 1 times')
  I.click('//div[contains(text(),"Click Me (pure pressable)")]')
  I.waitForText('You clicked 2 times')
})
