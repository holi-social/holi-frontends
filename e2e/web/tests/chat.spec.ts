import { clickElementByTestId, locateElementByTestId } from './helpers'
import { test } from './testmaster'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.describe('@Chat', () => {
  test('starts a chat from a users profile', async ({ userHandler }) => {
    await userHandler.asRandomUser(async (page) => {
      const e2eUserId = process.env.E2E_USER_ID
      await page.goto('/profile/' + e2eUserId)

      // at user profile
      await locateElementByTestId(page, 'user-profile-open-chat')

      // start chat
      await clickElementByTestId(page, 'user-profile-open-chat')

      // at chat room
      await locateElementByTestId(page, 'chat-message-input-input')
    })
  })
})
