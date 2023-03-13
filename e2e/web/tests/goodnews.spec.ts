import { Page, expect, test } from '@playwright/test'

import { checkAccessibility, clickElementByTestId, locateElementByTestId, waitForElementByTestId } from './helpers'

test.describe('@GoodNews', () => {
  test('user journey', async ({ page }) => {
    // prepare
    await page.goto('/')
    await clickElementByTestId(page, 'btn-to-continue-as-guest')

    await testIsAccessibleFromHomeScreen(page)
    await testAllowsPagination(page)
  })
})

const testIsAccessibleFromHomeScreen = async (page: Page) => {
  await clickElementByTestId(page, 'home-apps-button')
  await clickElementByTestId(page, 'app-tile-goodnews')

  await waitForElementByTestId(page, 'goodnews-app-home')
  expect(page.url()).toContain('/apps/goodnews')

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')

  // click first element in ScrollView
  await clickElementByTestId(page, 'goodnews-updates-item')

  // navigate to article in good news app
  await waitForElementByTestId(page, 'goodnews-detailview-container')
  expect(page.url()).toContain('/apps/goodnews?articleId=')

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')

  // click on "see more" / navigate to good news app
  await clickElementByTestId(page, 'goodnews-updates-load-more-button')
  await waitForElementByTestId(page, 'goodnews-detailview-container')

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')
}

const testAllowsPagination = async (page: Page) => {
  await waitForElementByTestId(page, 'goodnews-app-home')
  const countListItems = async () => {
    const listItems = await locateElementByTestId(page, 'goodnews-detailview-container')
    return await listItems.count()
  }
  await expect.poll(countListItems).toBeGreaterThan(1)

  const listItemCountBefore = await countListItems()
  await clickElementByTestId(page, 'btn-goodnews-list-load-more')
  await expect.poll(countListItems, { timeout: 30_000 }).toBeGreaterThan(listItemCountBefore)
  await checkAccessibility(page)
}
