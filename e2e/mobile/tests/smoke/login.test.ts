import { login, logout } from '../../helpers/auth'
import { navigateBackToHomeScreen } from '../../helpers/navigation'
import { tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

describe('@Login', () => {
  it('should not work with invalid credentials', async () => {
    await login({ email: 'asfd@asdf.de', password: '1234' })
    // see https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
    // for more ory error codes
    await tapOnElementWithTestId('toast-message-4000006')

    await tapOnElementWithTestId('nav-button-back')
    await navigateBackToHomeScreen('btn-to-home-view')

    // Login
    await login()

    // expect user profile
    await tapOnElementWithTestId('btn-to-profile-view')
    await waitForElementWithTestId('user-profile-full-name')

    // Logout
    await logout()
  })
})
