import { deleteAccount, registerNewUser } from '../../helpers/auth'
import { navigateBackToHomeScreen } from '../../helpers/navigation'
import { scrollToElementWithTestId, tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

// todo gregor - enable
describe('@Chat', () => {
  beforeAll(async () => {
    await registerNewUser()
  })

  xit('starts a chat from a users profile', async () => {
    // open profile of another user
    await scrollToElementWithTestId('user-card-suggestion-0', 'down')
    await tapOnElementWithTestId('user-card-suggestion-0')

    // at user profile
    await waitForElementWithTestId('user-profile-open-chat')

    // start chat
    await tapOnElementWithTestId('user-profile-open-chat')

    // at chat room
    await waitForElementWithTestId('chat-message-input-input')

    // navigate back to fix test flow
    await tapOnElementWithTestId('nav-button-back')
  })

  afterAll(async () => {
    await deleteAccount()
    await navigateBackToHomeScreen()
  })
})
