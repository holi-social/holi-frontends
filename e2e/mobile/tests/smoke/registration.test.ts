import { defaultPassword, deleteAccount, loginNewUser, logout, register, registerNewUser } from '../../helpers/auth'
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
    await register({ email, password: defaultPassword }, false)

    await waitForElementWithTestId('ory-traits-email-input-error-message')

    await tapOnElementWithTestId('btn-to-continue-as-guest')
    await loginNewUser(email)
    await deleteAccount()
  })
})
