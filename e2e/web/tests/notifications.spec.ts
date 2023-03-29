import { faker } from '@faker-js/faker'
import { BrowserContext, Page, expect } from '@playwright/test'

import { byTestId, clickElementByTestId, locateElementByTestId, loginAsE2EUser, sendConnectionRequest } from './helpers'
import { UserHandler, test } from './testmaster'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.setTimeout(180000)

test.describe('@Notifications', () => {
  test('user journey', async ({ context, page, userHandler }) => {
    await testIgnoringAndAcceptingConnectionRequests(context, page, userHandler)
    await testUserMentionInPostComment(context, page, userHandler)
  })
})

const testIgnoringAndAcceptingConnectionRequests = async (
  context: BrowserContext,
  page: Page,
  userHandler: UserHandler
) => {
  // create two connection requests from two separate users in parallel
  await Promise.all([
    userHandler.asRandomUser(async (page) => {
      await sendConnectionRequest(page)
    }),
    userHandler.asRandomUser(async (page) => {
      await sendConnectionRequest(page)
    }),
  ])

  await loginAsE2EUser(context, page)

  // go to notifications
  await clickElementByTestId(page, 'btn-to-home-view')
  await clickElementByTestId(page, 'btn-to-notifications')
  // notifications currently can take a while to load, therefore we're setting a long timeout here
  await expect(page.getByTestId('connection-notification-item').first()).toBeVisible({ timeout: 60000 })
  await page.waitForSelector(byTestId('connection-notification-item'))

  // ignore first CONNECTION_REQUEST
  // run the following actions in parallel
  await Promise.all([
    // wait for ignoring the connection request
    page.waitForResponse('/api/graphql'),
    // ignore the connection request
    clickElementByTestId(page, 'ignore-connection-request-button'),
  ])

  // accept second CONNECTION_REQUEST
  // run the following actions in parallel
  await Promise.all([
    // Waits for accepting the connection request
    page.waitForResponse('/api/graphql'),
    // accept the connection request
    clickElementByTestId(page, 'accept-connection-request-button'),
  ])
}

const testUserMentionInPostComment = async (context: BrowserContext, page: Page, userHandler: UserHandler) => {
  let commentTextContent = ''
  const createCommentWithE2EUserMention = async (page: Page) => {
    const userId = process.env.E2E_USER_ID
    expect(userId?.length).toBe(36)

    await page.goto('/profile/' + userId)
    const testUserFullName = await page.textContent(byTestId('user-profile-full-name'))
    const random = faker.random.alphaNumeric(5)
    const commentInput = `This is E2E test: ${random}! So, hey test user @${testUserFullName}`
    commentTextContent = commentInput.replace(new RegExp(`@${testUserFullName}`), `${testUserFullName}`) // remove the @ sign for matching the text later

    // go to some post and mention the test user
    await clickElementByTestId(page, 'btn-to-home-view')
    await clickElementByTestId(page, 'feed-insight-image-link')
    await clickElementByTestId(page, 'btn-to-post')
    // after clicking on notification we should go to post detail page and scroll to the comment
    // notifications currently can take a while to load, therefore we're setting a long timeout here
    await expect(page.getByTestId('post-detail-footer')).toBeVisible({ timeout: 60000 })
    await clickElementByTestId(page, 'post-detail-footer')
    await clickElementByTestId(page, 'post-comment')
    const input = await locateElementByTestId(page, 'post-comment-input')
    await input.fill(commentInput)
    await clickElementByTestId(page, 'holi-rich-text-input-suggestions-item')
    await clickElementByTestId(page, 'btn-submit-comment')
    await expect(page.getByText(commentTextContent)).toBeVisible()
  }

  await userHandler.asRandomUser(async (page) => {
    await createCommentWithE2EUserMention(page)
  })

  await loginAsE2EUser(context, page)

  // go to notifications and click first one post-comment-mention-notification

  await clickElementByTestId(page, 'btn-to-home-view')
  await clickElementByTestId(page, 'btn-to-notifications')
  // FIXME: notifications take a long time to load when there is a lot of them
  await expect(page.getByTestId('post-comment-mention').first()).toBeVisible({ timeout: 60000 })
  await clickElementByTestId(page, 'post-comment-mention')

  // after clicking on notification we should go to post detail page and scroll to the comment
  // FIXME: potentially long load time, loading a lot of comments takes a lot of time and we can't test for anything in between
  await expect(page.getByText(commentTextContent)).toBeVisible({ timeout: 60000 })
}
