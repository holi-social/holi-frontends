import { test } from '@playwright/test'

import { checkAccessibility, clickElementByTestId, locateElementByTestId, waitForElementByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('@Accessibility', () => {
  test('should work', async ({ page }) => {
    await checkAccessibility(page)
    await clickElementByTestId(page, 'btn-to-continue-as-guest')
    await waitForElementByTestId(page, 'home-feed-insights-heading')
    await checkAccessibility(page)

    await clickElementByTestId(page, 'btn-to-profile-view')
    await waitForElementByTestId(page, 'login-protection-heading')
    await checkAccessibility(page)
  })
})
