import { Page, expect } from '@playwright/test'

import { clickElementByTestId, locateElementByTestId } from './helpers'
import { test } from './testmaster'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await clickElementByTestId(page, 'btn-to-continue-as-guest')
})

test.describe('@Reactions', () => {
  test('React to a post and a comment with HEART.', async ({ userHandler }) => {
    await userHandler.withRandomUserSession(async (page) => {
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
    })
  })
})

const assertReactions = async (page: Page, testIdPrefix: string) => {
  const counter = await locateElementByTestId(page, testIdPrefix + '-counter')
  const countBefore = await counter.first().textContent()
  expect(countBefore).not.toBeNull()
  if (countBefore) {
    const cBefore = parseInt(countBefore)
    await clickElementByTestId(page, testIdPrefix)
    const getReactionCount = async () => {
      const counterElement = await locateElementByTestId(page, testIdPrefix + '-counter')
      const after = await counterElement.first().textContent()
      if (after) {
        return parseInt(after)
      }
      return 0
    }
    await expect.poll(getReactionCount, { timeout: 10000 }).toBeGreaterThan(cBefore)
  }
}
