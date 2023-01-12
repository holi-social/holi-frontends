import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'

import {
  byTestId,
  clickElementByTestId,
  createUserSendConnectionRequest,
  defaultAuthSteps,
  locateElementByTestId,
  waitForAnimationEnd,
  waitForElementByTestId,
} from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('@Notifications', () => {
  const emails = [
    `${faker.internet.userName()}${faker.random.numeric(4)}@e2etest.com`,
    `${faker.internet.userName()}${faker.random.numeric(4)}@e2etest.com`,
  ]
  const password = 'TheSamePassword4A11E2eUsers'

  test('create two users who initiates norifications to the test user', async ({ context, page }) => {
    for (const email of emails) {
      await createUserSendConnectionRequest({ context, page, email, password })
    }
  })

  test.describe('CONNECTION_REQUEST', async () => {
    test('ignore CONNECTION_REQUEST from first user and accept it from the second one', async ({ context, page }) => {
      // login with your test user
      await defaultAuthSteps(
        { context, page, email: process.env.E2E_USER_USERNAME, password: process.env.E2E_USER_PASSWORD },
        'login'
      )
      await waitForElementByTestId(page, 'btn-to-settings')

      // go to notifications
      await page.goto('/notifications')
      await waitForElementByTestId(page, 'connection-notification-item')

      // ignore first CONNECTION_REQUEST
      await clickElementByTestId(page, 'ignore-connection-request-button')
      await waitForAnimationEnd(page.locator(byTestId('connection-notification-loader-indicator')))

      // accept second CONNECTION_REQUEST
      await clickElementByTestId(page, 'accept-connection-request-button')
      await waitForAnimationEnd(page.locator(byTestId('connection-notification-loader-indicator')))
    })
  })

  test.describe('POST_COMMENT_USER_MENTION', async () => {
    let commentTextContent = ''

    test('a user mentions the test user in a post`s comment', async ({ context, page }) => {
      // login with the new created user
      await defaultAuthSteps({ context, page, email: emails[0], password }, 'login')
      await waitForElementByTestId(page, 'btn-to-settings')

      // go to the test user's profile page to get his full name
      const userId = process.env.E2E_USER_ID || 'empty'
      await page.goto('/profile/' + userId)
      const testUserFullName = await page.textContent(byTestId('user-profile-full-name'))
      const random = faker.random.alphaNumeric(5)
      const commentInput = `This is E2E test: ${random}! So, hey test user @${testUserFullName}`
      commentTextContent = `This is E2E test: ${random}! So, hey test user ${testUserFullName}`

      // go to some post and mention the test user
      await clickElementByTestId(page, 'btn-to-home-view')
      await clickElementByTestId(page, 'feed-insight-image-link')
      await clickElementByTestId(page, 'btn-to-post')
      await clickElementByTestId(page, 'post-detail-footer')
      await clickElementByTestId(page, 'post-comment')
      const input = await locateElementByTestId(page, 'post-comment-input')
      await input.fill(commentInput)
      await clickElementByTestId(page, 'holi-rich-text-input-suggestions-item')
      await clickElementByTestId(page, 'btn-submit-comment')
    })

    test.skip('the test user receives POST_COMMENT_USER_MENTION notification', async ({ context, page }) => {
      // login with your test user
      await defaultAuthSteps(
        { context, page, email: process.env.E2E_USER_USERNAME, password: process.env.E2E_USER_PASSWORD },
        'login'
      )
      await waitForElementByTestId(page, 'btn-to-settings')

      // go to notifications and click first one post-comment-mention-notification
      await page.goto('/notifications')
      await clickElementByTestId(page, 'post-comment-mention')

      // after clicking on notification we should go to post detail page and scroll to the comment
      await expect(page.getByText(commentTextContent)).toBeVisible()
    })
  })
})
