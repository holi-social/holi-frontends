import { faker } from '@faker-js/faker'
import { Page, expect } from '@playwright/test'

import {
  byTestId,
  clickElementByTestId,
  clickElementByTestIdAndWaitForToast,
  locateElementByTestId,
  loginAsE2EUser,
} from './helpers'
import { test } from './testmaster'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.describe('@Comment', () => {
  test('creates a comment and displays it in the post page.', async ({ userHandler }) => {
    await userHandler.asRandomUser(async (page) => {
      // go to home feed
      await clickElementByTestId(page, 'btn-to-home-view')

      await goToPost(page)
      await clickElementByTestId(page, 'post-detail-footer')

      // create e2e comment and fill the textinput
      const input = await locateElementByTestId(page, 'post-comment-input')
      const comment = `e2e comment ${faker.random.alphaNumeric(5)}`
      await input.fill(comment)

      // submit comment
      await clickElementByTestIdAndWaitForToast(page, 'btn-submit-comment', 'toast-SUCCESS')
      // wait until submit succeeded
      await page.waitForSelector(byTestId('btn-to-commenter-profile'))

      // check if comment is present in the comments page
      await expect(page.getByText(comment)).toBeVisible()
    })
  })

  test('delete a comment', async ({ context, page }) => {
    await loginAsE2EUser(context, page)
    await page.locator(byTestId('btn-to-home-view')).click()
    await goToPost(page)

    // create a comment
    await clickElementByTestId(page, 'post-detail-footer')
    const input = await locateElementByTestId(page, 'post-comment-input')
    const commentText = 'Hello, hello you all 😄'
    await input.fill(commentText)
    await clickElementByTestIdAndWaitForToast(page, 'btn-submit-comment', 'toast-SUCCESS')
    await expect(page.getByText(commentText).first()).toBeVisible()

    const commentsCount = await page.getByText(commentText).count()

    // delete comment
    clickTreeDotsMenu(page, commentText)
    await clickElementByTestId(page, 'delete-comment-button')
    await clickElementByTestId(page, 'delete-comment-confirmation-confirm')

    // comment should be gone
    await expect.poll(async () => await page.getByText(commentText).count()).toBeLessThan(commentsCount)
  })
})

const goToPost = async (page: Page) => {
  await clickElementByTestId(page, 'feed-insight-image-link')
  await clickElementByTestId(page, 'btn-to-post')
  await expect(page.getByTestId('post-detail-footer')).toBeVisible({ timeout: 60000 })
}

const clickTreeDotsMenu = async (page: Page, commentText: string) => {
  const commentView = page.locator(byTestId('comment-item'), { has: page.locator(`text="${commentText}"`) })
  await expect(commentView.first()).toBeVisible()
  const threeDotMenuButton = commentView.first().locator(byTestId('comment-three-dot-menu-button'))
  await expect(threeDotMenuButton).toBeVisible()
  threeDotMenuButton.click()
}
