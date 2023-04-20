import {
  defaultAuthSteps,
  defaultPassword,
  deleteAccount,
  loginNewUser,
  logout,
  registerNewUser,
} from '../../helpers/auth'
import { navigateBackToHomeScreen } from '../../helpers/navigation'
import { tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

const goFromRegistrationToHome = async () => {
  await navigateBackToHomeScreen('btn-to-home-view')
}

describe('@Registration - smoke', () => {
  it('Registration - Logout', async () => {
    // successful registration
    const email = await registerNewUser()

    await tapOnElementWithTestId('btn-to-profile-view')
    // wait for profile page to be loaded
    await waitForElementWithTestId('user-profile-full-name')

    // logout
    await logout()

    // try to create a new user with the same credentials
    await defaultAuthSteps({ email, password: defaultPassword }, 'registration', false)

    await waitForElementWithTestId('ory-traits-email-input-error-message')

    await goFromRegistrationToHome()
    await loginNewUser(email)
    await deleteAccount()
  })
})
