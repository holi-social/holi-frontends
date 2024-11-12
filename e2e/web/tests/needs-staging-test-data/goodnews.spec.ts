import { Page, expect } from '@playwright/test'

import { byTestId, checkAccessibility, clickElementByTestId, goodnewsRequestTimeout, proceedAsGuest } from '../helpers'
import { test } from '../testmaster'

test.describe('@GoodNews', () => {
  test('user journey', async ({ page }) => {
    test.skip(
      process.env.BASE_URL === 'http://localhost:3000',
      'These features have no local test data and can only be tested on staging.'
    )

    await proceedAsGuest(page)

    await testIsAccessibleFromHomeScreen(page)
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

  await checkAccessibility(page)
}
