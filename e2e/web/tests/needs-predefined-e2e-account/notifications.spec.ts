import { faker } from '@faker-js/faker'
import { type BrowserContext, type Page, expect } from '@playwright/test'

import { byTestId, clickElementByTestId, loginAsE2EUser, sendConnectionRequest } from '../helpers'
import { type SessionHandler, test } from '../testmaster'

// this is a long journey, but its as fast as our backends are
test.setTimeout(180000)

test.describe('@Notifications', () => {
  test('user journey', async ({ context, page, sessions }) => {
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
  const { page: userA } = await sessions.signUp()
  const { page: userB } = await sessions.signUp()
  await Promise.all([sendConnectionRequest(userA), sendConnectionRequest(userB)])

  await loginAsE2EUser(context, page)

  await page.goto('/notifications')
  // notifications currently can take a while to load, therefore we're setting a long timeout here
  await expect(page.getByTestId('connection-notification-item').first()).toBeVisible({ timeout: 10000 })
  await page.waitForSelector(byTestId('connection-notification-item'))

  // ignore first CONNECTION_REQUEST
  await clickElementByTestId(page, 'ignore-connection-request-button')

  // accept second CONNECTION_REQUEST
  await clickElementByTestId(page, 'accept-connection-request-button')
}

const testUserMentionInPostComment = async (context: BrowserContext, user: Page, sessions: SessionHandler) => {
  const { page: commentAuthor } = await sessions.signUp()
  const writtenComment = await createCommentWithE2EUserMention(commentAuthor)

  await loginAsE2EUser(context, user)

  // go to notifications and click first one post-comment-notification
  await user.goto('/notifications')
  await expect(user.getByTestId('post-comment').first()).toBeVisible()
  await clickElementByTestId(user, 'post-comment')

  // after clicking on notification we should go to post detail page and scroll to the comment
  await expect(user.getByText(writtenComment)).toBeVisible()
}

const createCommentWithE2EUserMention = async (user: Page) => {
  let commentTextContent = ''

  await test.step('can create a mentioning comment', async () => {
    const userId = process.env.E2E_USER_ID
    expect(userId?.length).toBe(36)

    await user.goto('/profile/' + userId)
    const testUserFullName = await user.textContent(byTestId('user-profile-full-name'))
    const random = faker.string.alphanumeric(5)
    const commentInput = `This is E2E test: ${random}! So, hey test user @${testUserFullName}`
    commentTextContent = commentInput.replace(new RegExp(`@${testUserFullName}`), `${testUserFullName}`) // remove the @ sign for matching the text later

    // go to some post and mention the test user
    await user.goto('/')
    await user.getByRole('button', { name: 'btn-comment-to-feed-post' }).first().click()
    // after clicking on notification we should go to post detail page and scroll to the comment
    // notifications currently can take a while to load, therefore we're setting a long timeout here
    await expect(user.getByTestId('post-detail-footer')).toBeVisible({ timeout: 60000 })
    await clickElementByTestId(user, 'post-detail-footer')
    await clickElementByTestId(user, 'post-comment')

    const input = user.getByRole('textbox') // we only have one comment input in this view
    await input.fill(commentInput)
    await clickElementByTestId(user, 'holi-rich-text-input-suggestions-item')
    await clickElementByTestId(user, 'btn-submit-comment')

    await expect(user.getByText(commentTextContent)).toBeVisible()
  })

  return commentTextContent
}
