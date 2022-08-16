Feature('@Login')

BeforeSuite(({ I }) => {
  I.navigateBackToHomeScreen()
})

After(({ I }) => {
  I.navigateBackToHomeScreen()
})

Scenario('Login - Logout', ({ I }) => {
  // should not work with invalid credentials
  I.defaultLoginSteps({ username: 'asfd@asdf.de', password: '1234' })
  // see https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
  // for more ory error codes
  I.seeElementWithTestId('ory-message-4000006')
  I.navigateBackToHomeScreen()

  // should work with valid credentials
  // Login
  I.defaultLoginSteps()
  // Logout
  I.tapOnElementWithTestId('btn-to-logout')
  I.tapOnElementWithTestId('confirm-logout-button')
  I.seeElementWithTestId('btn-to-login-form')
})
