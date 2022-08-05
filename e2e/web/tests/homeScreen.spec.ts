import { expect, test } from '@playwright/test'

import { clickElementByTestId, waitForElementByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('@HomeScreen', () => {
  test('should work', async ({ page }) => {
    await waitForElementByTestId(page, 'home-feed-topics-heading')
    await clickElementByTestId(page, 'app-tile-volunteering')

    await page.waitForSelector('text="Volunteering"')
    await clickElementByTestId(page, 'nav-button-home')

    await waitForElementByTestId(page, 'home-feed-topics-heading')
  })

  test('has feed topic headline', async ({ page }) => {
    await waitForElementByTestId(page, 'home-feed-topics-heading')
  })

  test('has feed topic items and clicking them leads to overview page.', async ({ page }) => {
    await clickElementByTestId(page, 'feed-topic-image-link')
    await page.waitForNavigation()
    expect(page.url()).toContain('topics/')

    await page.goBack()

    await clickElementByTestId(page, 'feed-topic-contributors-link')
    await waitForElementByTestId(page, 'feed-topic-editors-headline')
  })
})
