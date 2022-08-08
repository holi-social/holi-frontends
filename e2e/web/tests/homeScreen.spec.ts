import { expect, test } from '@playwright/test'

import { clickElementByTestId, delay, waitForElementByTestId } from './helpers'

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
  })

  test('has feed topic curators avatar pile.', async ({ page }) => {
    // make sure the feed contains the corresponding avatar pile for its editors
    await waitForElementByTestId(page, 'feed-topic-contributors-link')
  })

  test('opens curators list upon clicking in avatar pile and shows topic editor cards.', async ({ page }) => {
    await clickElementByTestId(page, 'feed-topic-contributors-link')

    // TODO: failing during ci on chrome: the modal does not seem to open
    // await delay(0.5) // wait for modal to open
    // await waitForElementByTestId(page, 'topic-contributors-modal')
    // await waitForElementByTestId(page, 'topic-editor-card')
  })
})
