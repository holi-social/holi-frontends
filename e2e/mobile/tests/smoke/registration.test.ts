import {
  defaultPassword,
  deleteAccount,
  loginNewUser,
  logout,
  register,
  registerNewUser,
  testIdContinueAsGuest,
} from '../../helpers/auth'
import { tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

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
    await register({ email, password: defaultPassword, skipAccountSetup: true })

    await waitForElementWithTestId('ory-traits-email-input-error-message')

    await tapOnElementWithTestId(testIdContinueAsGuest)
    await loginNewUser(email)
    await deleteAccount()
  })
})
