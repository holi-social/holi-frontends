import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'

import { clickElementByTestId, defaultAuthSteps, locateElementByTestId } from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('@Comment', () => {
  test('creates a comment and displays it in the post page.', async ({ context, page }) => {
    // login
    await defaultAuthSteps({ context, page })

    // go to home feed
    await clickElementByTestId(page, 'nav-button-home')

    // click first insight image link
    await clickElementByTestId(page, 'feed-insight-image-link')

    // click first post within the insight
    await clickElementByTestId(page, 'btn-to-post')

    // click the comment footer button
    await clickElementByTestId(page, 'post-detail-footer')

    // create e2e comment and fill the textinput
    const input = await locateElementByTestId(page, 'post-comment-input')
    const comment = `e2e comment ${faker.random.alphaNumeric(5)}`
    await input.fill(comment)

    // submit comment
    await clickElementByTestId(page, 'btn-submit-comment')

    // check if comment is present in the comments page
    await expect(page.getByText(comment)).toBeVisible()
  })
})
