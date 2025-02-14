import { checkAccessibility, clickElementByTestId, locateElementByTestId } from '../helpers'
import { test } from '../testmaster'

test.describe('@Chat', () => {
  test('starts a chat from a users profile', async ({ authenticatedSession: { page } }) => {
    const e2eUserId = process.env.E2E_USER_ID
    await page.goto('/profile/' + e2eUserId)

    // at user profile
    await locateElementByTestId(page, 'user-profile-open-chat')

    // start chat
    await clickElementByTestId(page, 'user-profile-open-chat')

    // at chat room
    await locateElementByTestId(page, 'chat-message-input-input')
    await checkAccessibility(page)
  })
})
