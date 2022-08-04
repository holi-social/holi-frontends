import { expect, test } from '@playwright/test'

import { byTestId, delay } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('@HomeScreen', () => {
  test('should work', async ({ page }) => {
    await page.waitForSelector(byTestId('home-feed-topics-heading'))
    await page.locator(byTestId('app-tile-volunteering')).click()

    await page.waitForSelector('text="Volunteering"')
    await page.locator(byTestId('nav-button-home')).click()

    await page.waitForSelector(byTestId('home-feed-topics-heading'))
  })

  test('has feed topic headline', async ({ page }) => {
    await page.waitForSelector(byTestId('home-feed-topics-heading'))
  })

  test('has feed topic items and clicking them leads to overview page.', async ({ page }) => {
    await Promise.all([page.click(byTestId('feed-topic-image-link')), page.waitForNavigation()])
    expect(page.url()).toContain('topics/')
  })

  test('has feed topic curators avatar pile.', async ({ page }) => {
    // make sure the feed contains the corresponding avatar pile for its editors
    await page.waitForSelector(byTestId('feed-topic-contributors-link'))
  })

  test('opens curators list upon clicking in avatar pile and shows topic editor cards.', async ({ page }) => {
    await page.waitForSelector(byTestId('feed-topic-contributors-link'))
    await page.locator(byTestId('feed-topic-contributors-link')).first().click()

    await delay(0.5) // wait for modal to open
    await page.locator(byTestId('topic-contributors-modal'))
    await page.waitForSelector(byTestId('topic-editor-card'))
  })

  test('opens curators list upon clicking in avatar pile and correctly closes it upon clicking the modal close button.', async ({
    page,
  }) => {
    await page.waitForSelector(byTestId('feed-topic-contributors-link'))
    await page.locator(byTestId('feed-topic-contributors-link')).first().click()

    await delay(0.5) // wait for modal to open
    await page.locator(byTestId('topic-contributors-modal'))
    await page.locator(byTestId('topic-contributors-modal-close')).click()

    await delay(0.5) // wait for modal to close
    expect(await page.locator(byTestId('topic-contributors-modal-close'))).not.toBeVisible()
  })
})
