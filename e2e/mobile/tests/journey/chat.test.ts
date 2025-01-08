import { deleteAccount, registerNewUser } from '../../helpers/auth'
import {
  checkIfElementWithTestIdExists,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
} from '../../helpers/selectors'

describe('@Chat', () => {
  it('starts a chat from a users profile', async () => {
    //setup
    await registerNewUser()

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

    // at user profile
    await waitForElementWithTestId('user-profile-open-chat')

    // start chat
    await tapOnElementWithTestId('user-profile-open-chat')

    // at chat room
    await waitForElementWithTestId('chat-message-input-input')

    // navigate back to fix test flow
    await tapOnElementWithTestId('nav-button-back')

    //teardown
    await deleteAccount()
  })
})
