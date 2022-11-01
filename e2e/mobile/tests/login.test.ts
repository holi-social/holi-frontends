import { defaultAuthSteps, logout } from '../helpers/auth'
import { tapOnElementWithTestId, waitForElementWithTestId } from '../helpers/selectors'

describe('@Login', () => {
  it('should not work with invalid credentials', async () => {
    await defaultAuthSteps({ email: 'asfd@asdf.de', password: '1234' })
    // see https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
    // for more ory error codes
    await waitForElementWithTestId('toast-message-4000006')

    await tapOnElementWithTestId('nav-button-back')
    await tapOnElementWithTestId('nav-button-home')
  })

  it('should work with valid credentials', async () => {
    // Login
    await defaultAuthSteps()

    // expect user profile
    await tapOnElementWithTestId('btn-to-profile-view')
    await waitForElementWithTestId('user-profile-full-name')

    // Logout
    await logout()
  })
})
