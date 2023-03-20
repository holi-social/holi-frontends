import { defaultAuthSteps, logout } from '../../helpers/auth'
import { navigateBackToHomeScreen } from '../../helpers/navigation'
import { tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

describe('@Login test1', () => {
  it('should not work with invalid credentials', async () => {
    await defaultAuthSteps({ email: 'asfd@asdf.de', password: '1234' })
    // see https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
    // for more ory error codes
    await tapOnElementWithTestId('toast-message-4000006')

    await tapOnElementWithTestId('nav-button-back')
    await navigateBackToHomeScreen('btn-to-home-view')

    // Login
    await defaultAuthSteps()

    // expect user profile
    await tapOnElementWithTestId('btn-to-profile-view')
    await waitForElementWithTestId('user-profile-full-name')

    // Logout
    await logout()
  })
})
