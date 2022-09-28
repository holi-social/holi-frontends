import { expect, test } from '@playwright/test'

import { clickElementByTestId, locateElementByTestId, waitForElementByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/apps/donations')
})

test.describe('@Donations', () => {
  test('should be accessible from home screen', async ({ page }) => {
    await page.goto('/')
    await waitForElementByTestId(page, 'home-feed-topics-heading')
    await clickElementByTestId(page, 'app-tile-donations')

    await waitForElementByTestId(page, 'donations-list-container')
    expect(page.url()).toContain('/apps/donations')
  })

  test('should display multiple projects', async ({ page }) => {
    await waitForElementByTestId(page, 'donations-list-container')
    const listItems = await locateElementByTestId(page, 'donations-list-item')
    expect(listItems).toBeGreaterThan(1)
  })
})
