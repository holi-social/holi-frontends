import { expect, test } from '@playwright/test'

import { checkAccessibility, clickElementByTestId, locateElementByTestId, waitForElementByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/apps/goodnews')
})

// sometimes responses to goodnews take a little longer (10s < response latency < 30s)
// increase timeout from default of 5 seconds to 30 seconds
const goodnewsTimeout = { timeout: 30_000 }

test.describe('@GoodNews', () => {
  test('should be accessible from home screen', async ({ page }) => {
    await page.goto('/')
    await clickElementByTestId(page, 'home-apps-button')
    await clickElementByTestId(page, 'app-tile-goodnews')

    await waitForElementByTestId(page, 'goodnews-list-container')
    expect(page.url()).toContain('/apps/goodnews')
  })

  test('should display multiple projects', async ({ page }) => {
    await waitForElementByTestId(page, 'goodnews-list-container')
    const listItems = await locateElementByTestId(page, 'goodnews-list-item')
    const itemCount = await listItems.count()
    expect(itemCount).toBeGreaterThan(1)

    await checkAccessibility(page)
  })

  test('should allow pagination', async ({ page }) => {
    await waitForElementByTestId(page, 'goodnews-list-container')
    const countListItems = async () => {
      const listItems = await locateElementByTestId(page, 'goodnews-list-item')
      return await listItems.count()
    }
    await expect.poll(countListItems).toBeGreaterThan(0)
    const listItemCountBefore = await countListItems()
    await clickElementByTestId(page, 'btn-goodnews-list-load-more')
    await expect.poll(countListItems, goodnewsTimeout).toBeGreaterThan(listItemCountBefore)
  })
})
