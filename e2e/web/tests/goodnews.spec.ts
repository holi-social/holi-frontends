import { expect, test } from '@playwright/test'

import { checkAccessibility, clickElementByTestId, locateElementByTestId, waitForElementByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/apps/goodnews')
})

// const goodnewsTimeout = { timeout: 30_000 }

test.describe('@GoodNews', () => {
  test('should be accessible from home screen', async ({ page }) => {
    await page.goto('/')
    await clickElementByTestId(page, 'home-apps-button')
    await clickElementByTestId(page, 'app-tile-goodnews')

    await waitForElementByTestId(page, 'goodnews-app-home')
    expect(page.url()).toContain('/apps/goodnews')
  })

  test('should display multiple projects', async ({ page }) => {
    await waitForElementByTestId(page, 'goodnews-app-home')
    const listItems = await locateElementByTestId(page, 'goodnews-article-component')
    const itemCount = await listItems.count()
    expect(itemCount).toBeGreaterThan(1)

    await checkAccessibility(page)
  })

  test('should allow pagination', async ({ page }) => {
    await waitForElementByTestId(page, 'goodnews-app-home')
    const countListItems = async () => {
      const listItems = await locateElementByTestId(page, 'goodnews-article-component')
      return await listItems.count()
    }
    await expect.poll(countListItems).toBeGreaterThan(0)

    /* TODO HOLI-2806 fix test
    const listItemCountBefore = await countListItems()
    await clickElementByTestId(page, 'btn-goodnews-list-load-more')
    await expect.poll(countListItems, goodnewsTimeout).toBeGreaterThan(listItemCountBefore)
     */
  })
})
