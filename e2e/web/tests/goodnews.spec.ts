import { Page, expect } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  goodnewsRequestTimeout,
  locateElementByTestId,
  proceedAsGuest,
} from './helpers'
import { test } from './testmaster'

test.setTimeout(120000)

test.describe('@GoodNews', () => {
  test('user journey', async ({ page }) => {
    // prepare
    await proceedAsGuest(page)

    await testIsAccessibleFromHomeScreen(page)
    await testAllowsPagination(page)
  })
})

const testIsAccessibleFromHomeScreen = async (page: Page) => {
  await clickElementByTestId(page, 'goodnews-reco-slider-heading-button')

  await page.waitForSelector(byTestId('goodnews-app-home'), { timeout: goodnewsRequestTimeout })
  expect(page.url()).toContain('/apps/goodnews')

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')
  await page.waitForSelector(byTestId('goodnews-reco-slider-list'), { timeout: goodnewsRequestTimeout })

  // click first element in ScrollView
  await clickElementByTestId(page, 'goodnews-reco-slider-card')

  // navigate to article in good news app
  await page.waitForSelector(byTestId('goodnews-detailview-container'))
  expect(page.url()).toContain('/apps/goodnews?articleId=')

  // navigate back
  await clickElementByTestId(page, 'nav-button-back')
  await page.waitForSelector(byTestId('goodnews-reco-slider-list'), { timeout: goodnewsRequestTimeout })

  // click on "see more" / navigate to good news app
  await clickElementByTestId(page, 'goodnews-reco-slider-load-more-button')
  await page.waitForSelector(byTestId('goodnews-detailview-container'))
}

const testAllowsPagination = async (page: Page) => {
  await page.waitForSelector(byTestId('goodnews-app-home'))
  await page.waitForSelector(byTestId('btn-to-article-external'))
  const countListItems = async () => {
    const listItems = await locateElementByTestId(page, 'goodnews-detailview-container')
    return await listItems.count()
  }
  await expect.poll(countListItems).toBeGreaterThan(1)

  // TODO btn-goodnews-list-load-more is not accessible, because it's only visible on the last slider
  // const listItemCountBefore = await countListItems()
  // await clickElementByTestId(page, 'btn-goodnews-list-load-more')
  // await expect.poll(countListItems, { timeout: goodnewsRequestTimeout }).toBeGreaterThan(listItemCountBefore)
  await checkAccessibility(page)
}
