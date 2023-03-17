import { faker } from '@faker-js/faker'
import { expect } from '@playwright/test'

import { clickElementByTestId, locateElementByTestId, waitForElementByTestId } from './helpers'
import { test } from './testmaster'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.describe('@Comment', () => {
  test('creates a comment and displays it in the post page.', async ({ userHandler }) => {
    await userHandler.asRandomUser(async (page) => {
      // go to home feed
      await clickElementByTestId(page, 'btn-to-home-view')

      // click first insight image link
      await clickElementByTestId(page, 'feed-insight-image-link')

      // click first post within the insight
      await clickElementByTestId(page, 'btn-to-post')

      // click the comment footer button. Can be slow due to many comments, so safeguarded with an extra long timeout
      await expect(page.getByTestId('post-detail-footer')).toBeVisible({ timeout: 60000 })
      await clickElementByTestId(page, 'post-detail-footer')

      // create e2e comment and fill the textinput
      const input = await locateElementByTestId(page, 'post-comment-input')
      const comment = `e2e comment ${faker.random.alphaNumeric(5)}`
      await input.fill(comment)

      // submit comment
      await clickElementByTestId(page, 'btn-submit-comment')
      // wait until submit succeeded
      await waitForElementByTestId(page, 'btn-to-commenter-profile')

      // check if comment is present in the comments page
      await expect(page.getByText(comment)).toBeVisible()
    })
  })
})
