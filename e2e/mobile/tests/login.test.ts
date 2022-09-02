import { defaultLoginSteps } from '../helpers/login'
import { tapOnElementWithTestId, waitForElementWithTestId } from '../helpers/selectors'

describe('@Login', () => {
  it('should not work with invalid credentials', async () => {
    await defaultLoginSteps({ username: 'asfd@asdf.de', password: '1234' })
    // see https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
    // for more ory error codes
    await waitForElementWithTestId('ory-message-4000006')

    await tapOnElementWithTestId('nav-button-back')
    await tapOnElementWithTestId('nav-button-home')
  })

  it('should work with valid credentials', async () => {
    // Login
    await defaultLoginSteps()

    // Logout// open user profile
    await tapOnElementWithTestId('btn-to-profile-view')
    await tapOnElementWithTestId('btn-to-logout')
    await tapOnElementWithTestId('confirm-logout-button')
    await waitForElementWithTestId('btn-to-login-form')
  })
})
