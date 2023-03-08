import { Page, expect, test } from '@playwright/test'

import { clickElementByTestId, delay, deleteAccount, locateElementByTestId, registerNewUser } from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await clickElementByTestId(page, 'btn-to-continue-as-guest')
})

test.describe('@Reactions', () => {
  test('React to a post and a comment with HEART.', async ({ context, page }) => {
    // login
    await registerNewUser({ page, context })
    // go to home feed
    await clickElementByTestId(page, 'btn-to-home-view')

    // click first insight image link
    await clickElementByTestId(page, 'feed-insight-image-link')

    // check reactions on first post
    await assertReactions(page, 'btn-react-to-post-HEART')

    // open first post
    await clickElementByTestId(page, 'btn-to-post')

    // check reactions on first comment
    await assertReactions(page, 'btn-react-to-comment-HEART')

    await deleteAccount(page)
  })
})

const assertReactions = async (page: Page, s: string) => {
  const counter = await locateElementByTestId(page, s + '-counter')
  const countBefore = await counter.first().textContent()
  expect(countBefore).not.toBeNull()
  let countAfter = countBefore
  await clickElementByTestId(page, s)
  let tryCount = 100
  while (countBefore === countAfter && tryCount > 0) {
    await delay(0.1)
    const after = await counter.first().textContent()
    if (after) countAfter = after
    --tryCount
  }
  if (countBefore && countAfter) {
    const cBefore = parseInt(countBefore)
    const cAfter = parseInt(countAfter)
    expect(cAfter).toBe(cBefore + 1)
  }
}
