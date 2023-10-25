import { Page, expect } from '@playwright/test'

import { byTestId, clickElementByTestId, locateElementByTestId } from './helpers'
import { test } from './testmaster'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.describe('@Reactions', () => {
  test('user story', async ({ userHandler }) => {
    await userHandler.asRandomUser(async (page) => {
      // go to home feed
      await clickElementByTestId(page, 'btn-to-home-view')

      // click first insight image link
      await clickElementByTestId(page, 'feed-insight-image-link')
      await page.waitForSelector(byTestId('insight-headline'))

      // check reactions on first post
      await assertReactions(page, 'btn-react-to-post-HEART')

      // open first post
      await clickElementByTestId(page, 'btn-to-post')
      await page.waitForSelector(byTestId('post-image'))

      // TODO assure a comment by commenting ourselves, otherwise if no comment, the test fails

      // check reactions on first comment
      await assertReactions(page, 'btn-react-to-comment-HEART')
    })
  })
})

const assertReactions = async (page: Page, testIdPrefix: string) => {
  const counter = (await locateElementByTestId(page, testIdPrefix + '-counter')).first()
  const countBefore = await counter.textContent()
  expect(countBefore).not.toBeNull()
  if (countBefore) {
    const cBefore = parseInt(countBefore)
    await clickElementByTestId(page, testIdPrefix)
    const getReactionCount = async () => {
      const after = await counter.textContent()
      if (after) {
        return parseInt(after)
      }
      return 0
    }
    await expect.poll(getReactionCount, { timeout: 10000 }).toBeGreaterThan(cBefore)
  }
}
