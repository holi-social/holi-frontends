import { faker } from '@faker-js/faker'
import { BrowserContext, Page, expect } from '@playwright/test'

import { byTestId, clickElementByTestId, locateElementByTestId, loginAsE2EUser, sendConnectionRequest } from './helpers'
import { SessionHandler, test } from './testmaster'

test.setTimeout(180000)

test.describe('@Notifications', () => {
  test('user journey', async ({ context, page, sessions, browserName }) => {
    // FIXME: After Expo upgrade to 49 Mobile_WebKit has a bug `Error: page.goto: Navigation to "http://localhost:3000/login" is interrupted by another navigation to "http://localhost:3000/profile"`
    test.skip(browserName === 'webkit', 'FIXME: After Expo upgrade to 49 Mobile_WebKit has a bug')

    await testIgnoringAndAcceptingConnectionRequests(context, page, sessions)
    await testUserMentionInPostComment(context, page, sessions)
  })
})

const testIgnoringAndAcceptingConnectionRequests = async (
  context: BrowserContext,
  page: Page,
  sessions: SessionHandler
) => {
  // create two connection requests from two separate users
  const { page: randomPage1 } = await sessions.signUp()
  const { page: randomPage2 } = await sessions.signUp()
  await Promise.all([sendConnectionRequest(randomPage1), sendConnectionRequest(randomPage2)])

  await loginAsE2EUser(context, page)

  // go to notifications
  await clickElementByTestId(page, 'btn-to-notifications')
  // notifications currently can take a while to load, therefore we're setting a long timeout here
  await expect(page.getByTestId('connection-notification-item').first()).toBeVisible({ timeout: 10000 })
  await page.waitForSelector(byTestId('connection-notification-item'))

  // ignore first CONNECTION_REQUEST
  await clickElementByTestId(page, 'ignore-connection-request-button')

  // accept second CONNECTION_REQUEST
  await clickElementByTestId(page, 'accept-connection-request-button')
}

const testUserMentionInPostComment = async (context: BrowserContext, page: Page, sessions: SessionHandler) => {
  let commentTextContent = ''

  const createCommentWithE2EUserMention = async (page: Page) => {
    const userId = process.env.E2E_USER_ID
    expect(userId?.length).toBe(36)

    await page.goto('/profile/' + userId)
    const testUserFullName = await page.textContent(byTestId('user-profile-full-name'))
    const random = faker.string.alphanumeric(5)
    const commentInput = `This is E2E test: ${random}! So, hey test user @${testUserFullName}`
    commentTextContent = commentInput.replace(new RegExp(`@${testUserFullName}`), `${testUserFullName}`) // remove the @ sign for matching the text later

    // go to some post and mention the test user
    await clickElementByTestId(page, 'btn-to-home-view')
    await page.getByRole('button', { name: 'btn-comment-to-feed-post' }).first().click()
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

  const { page: mentioningPage } = await sessions.signUp()
  await createCommentWithE2EUserMention(mentioningPage)

  await loginAsE2EUser(context, page)

  // go to notifications and click first one post-comment-notification
  await clickElementByTestId(page, 'btn-to-notifications')
  // FIXME: notifications take a long time to load when there is a lot of them
  await expect(page.getByTestId('post-comment').first()).toBeVisible({ timeout: 120_000 })
  await clickElementByTestId(page, 'post-comment')

  // after clicking on notification we should go to post detail page and scroll to the comment
  // FIXME: potentially long load time, loading a lot of comments takes a lot of time and we can't test for anything in between
  await expect(page.getByText(commentTextContent)).toBeVisible({ timeout: 120_0000 })
}
