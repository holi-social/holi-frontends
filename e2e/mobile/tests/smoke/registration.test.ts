import {
  defaultAuthSteps,
  defaultPassword,
  deleteAccount,
  loginNewUser,
  logout,
  registerNewUser,
} from '../../helpers/auth'
import { navigateBackToHomeScreen } from '../../helpers/navigation'
import { itif } from '../../helpers/platform'
import { waitForElementWithTestId } from '../../helpers/selectors'

const goFromRegistrationToHome = async () => {
  await navigateBackToHomeScreen('btn-to-home-view')
}

describe('@Registration - smoke', () => {
  itif(platform !== 'ios', 'Registration - Logout', async () => {
    // successful registration
    const email = await registerNewUser()

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
