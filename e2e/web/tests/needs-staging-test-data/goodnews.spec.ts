import { expect } from '@playwright/test'

import { byTestId, checkAccessibility, proceedAsGuest } from '../helpers'
import { test } from '../testmaster'

test.describe('@GoodNews', () => {
  test('should display Good News  articles', async ({ page }) => {
    test.skip(
      process.env.BASE_URL === 'http://localhost:3000',
      'These features have no local test data and can only be tested on staging.'
    )

    await proceedAsGuest(page)

    await page.goto('/apps/goodnews')

    const firstArticle = await page.locator(byTestId('goodnews-detailview-container'))

    await expect(firstArticle.locator('h1')).not.toBeEmpty()
    await expect(firstArticle.getByRole('button', { name: 'Read article' })).toBeVisible()

    await checkAccessibility(page)
  })
})
