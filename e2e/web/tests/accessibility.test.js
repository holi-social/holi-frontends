Feature('Accessibility Test')

Scenario('Playwright web page accessibility test', async ({ I }) => {
  I.amOnPage('/')
  I.checkAccessibility()
})
