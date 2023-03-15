import { faker } from '@faker-js/faker'
import { Browser, BrowserContext, Page, expect, test } from '@playwright/test'

import {
  byTestId,
  clickElementByTestId,
  defaultAuthSteps,
  locateElementByTestId,
  sendConnectionRequest,
  waitForAnimationEnd,
  waitForElementByTestId,
  withRandomUserSession,
} from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.setTimeout(180000)

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('@Notifications', () => {
  test('user journey', async ({ browser, context, page }) => {
    await testIgnoringAndAcceptingConnectionRequests(browser, context, page)
    await testUserMentionInPostComment(browser, context, page)
  })
})

const testIgnoringAndAcceptingConnectionRequests = async (browser: Browser, context: BrowserContext, page: Page) => {
  // create two connection requests from two separate users in parallel
  const cleanupHooks = await Promise.all([
    withRandomUserSession(browser, async (page) => {
      await sendConnectionRequest(page)
    }),
    withRandomUserSession(browser, async (page) => {
      await sendConnectionRequest(page)
    }),
  ])

  // login with your test user
  await defaultAuthSteps({ context, page }, 'login')
  await waitForElementByTestId(page, 'user-profile-full-name')

  // go to notifications
  await clickElementByTestId(page, 'btn-to-home-view')
  await waitForElementByTestId(page, 'btn-to-notifications')
  await clickElementByTestId(page, 'btn-to-notifications')

  // await page.goto('/notifications')
  await waitForElementByTestId(page, 'connection-notification-item')

  // ignore first CONNECTION_REQUEST
  // run the following actions in parallel
  await Promise.all([
    // wait for ignoring the connection request
    page.waitForResponse('/api/graphql'),
    waitForAnimationEnd(page.locator(byTestId('connection-notification-loader-indicator'))),
    // ignore the connection request
    clickElementByTestId(page, 'ignore-connection-request-button'),
  ])

  // accept second CONNECTION_REQUEST
  // run the following actions in parallel
  await Promise.all([
    // Waits for accepting the connection request
    page.waitForResponse('/api/graphql'),
    waitForAnimationEnd(page.locator(byTestId('connection-notification-loader-indicator'))),
    // accept the connection request
    clickElementByTestId(page, 'accept-connection-request-button'),
  ])

  await Promise.all(cleanupHooks.map((fn) => fn())) // clean up random users and wait for it
}

const testUserMentionInPostComment = async (browser: Browser, context: BrowserContext, page: Page) => {
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
    // FIXME: potentially long load time, loading a lot of comments takes a lot of time and we can't test for anything in between
    await expect(page.getByTestId('post-detail-footer')).toBeVisible({ timeout: 60000 })
    await clickElementByTestId(page, 'post-detail-footer')
    await clickElementByTestId(page, 'post-comment')
    const input = await locateElementByTestId(page, 'post-comment-input')
    await input.fill(commentInput)
    await clickElementByTestId(page, 'holi-rich-text-input-suggestions-item')
    await clickElementByTestId(page, 'btn-submit-comment')
    await expect(page.getByText(commentTextContent)).toBeVisible()
  }

  const cleanupHookCreateCommentSession = await withRandomUserSession(browser, async (page) => {
    await createCommentWithE2EUserMention(page)
  })

  await defaultAuthSteps({ context, page }, 'login')
  await waitForElementByTestId(page, 'user-profile-full-name')

  // go to notifications and click first one post-comment-mention-notification

  await clickElementByTestId(page, 'btn-to-home-view')
  await clickElementByTestId(page, 'btn-to-notifications')
  // FIXME: notifications take a long time to load when there is a lot of them
  await expect(page.getByTestId('notifications-overview')).toBeVisible({ timeout: 60000 })
  await clickElementByTestId(page, 'post-comment-mention')

  // after clicking on notification we should go to post detail page and scroll to the comment
  // FIXME: potentially long load time, loading a lot of comments takes a lot of time and we can't test for anything in between
  await expect(page.getByText(commentTextContent)).toBeVisible({ timeout: 60000 })

  await cleanupHookCreateCommentSession()
}
