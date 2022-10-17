import { defaultAuthSteps, logout } from '../helpers/auth'
import { navigateBackToHomeScreen } from '../helpers/navigation'
import { scrollToElementWithTestId, tapOnElementWithTestId, waitForElementWithTestId } from '../helpers/selectors'

describe('@Profile', () => {
  it('should navigate to user from suggestions', async () => {
    // login
    await defaultAuthSteps()

    // go home
    await navigateBackToHomeScreen()

    // user suggestions element should be visible
    await scrollToElementWithTestId('user-suggestions', 'down')

    // tap on first user in list
    await tapOnElementWithTestId('user-card-suggestion-0')

    // expect user profile
    await waitForElementWithTestId('user-profile-full-name')

    // logout
    await logout()
  })
})
