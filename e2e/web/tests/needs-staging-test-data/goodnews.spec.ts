import { expect } from '@playwright/test'

import { byTestId, checkAccessibility, denyConsent, isRunningLocally } from '../helpers'
import { test } from '../testmaster'

test.describe('@GoodNews', () => {
  test('should display Good News articles', async ({ page }) => {
    test.skip(isRunningLocally(), 'These features have no local test data and can only be tested on staging.')

    await page.goto('/apps/goodnews')
    await denyConsent(page)

    const firstArticle = page.locator(byTestId('goodnews-detailview-container')).first()

    await expect(firstArticle.locator('h1')).not.toBeEmpty()
    await expect(firstArticle.getByRole('button', { name: 'Read article' })).toBeVisible()

    await checkAccessibility(page)
  })
})
