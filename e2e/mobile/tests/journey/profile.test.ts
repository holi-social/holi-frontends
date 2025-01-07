import { login, logout } from '../../helpers/auth'
import {
  checkIfElementWithTestIdExists,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
} from '../../helpers/selectors'

describe('@Profile', () => {
  it('should navigate to user from suggestions', async () => {
    // login
    await login()

    if (await checkIfElementWithTestIdExists('feed-posts')) {
      // New feed: Search for first post-author and tap on avatar
      await scrollToElementWithTestId('post-author', 'down')

      await tapOnElementWithTestId('avatar-btn')
    } else {
      // Legacy feed: user suggestions heading should be visible
      await scrollToElementWithTestId('user-suggestions', 'down')

      // tap on first user in list
      await scrollToElementWithTestId('user-card-suggestion-0', 'down', { maxAttempts: 3 })
      await tapOnElementWithTestId('user-card-suggestion-0')
    }

    // expect user profile
    await waitForElementWithTestId('user-profile-full-name')

    // logout
    await logout()
  })
})
