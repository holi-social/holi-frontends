import { expect, test } from '@playwright/test'

import { clickElementByTestId, locateElementByTestId, waitForElementByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/apps/donations')
})

test.describe('@Donations', () => {
  test('should be accessible from home screen', async ({ page }) => {
    await page.goto('/')
    await clickElementByTestId(page, 'home-apps-button')
    await clickElementByTestId(page, 'app-tile-donations')

    await waitForElementByTestId(page, 'donations-list-container')
    expect(page.url()).toContain('/apps/donations')
  })

  test('should display multiple projects', async ({ page }) => {
    await waitForElementByTestId(page, 'donations-list-container')
    const listItems = await locateElementByTestId(page, 'donations-list-item')
    const itemCount = await listItems.count()
    expect(itemCount).toBeGreaterThan(1)
  })

  test('should allow pagination', async ({ page }) => {
    await waitForElementByTestId(page, 'donations-list-container')
    const countListItems = async () => {
      const listItems = await locateElementByTestId(page, 'donations-list-item')
      return await listItems.count()
    }
    await expect.poll(countListItems).toBeGreaterThan(0)
    const listItemCountBefore = await countListItems()
    await clickElementByTestId(page, 'btn-donation-list-load-more')
    await expect.poll(countListItems).toBeGreaterThan(listItemCountBefore)
  })

  test('should display project details', async ({ page }) => {
    await waitForElementByTestId(page, 'donations-list-container')
    // click first element in list
    await clickElementByTestId(page, 'donations-list-item')

    await waitForElementByTestId(page, 'donations-project-detail-heading')
    expect(page.url()).toContain('/apps/donations/project/')
  })
})
