import { expect, test } from '@playwright/test'

import { byTestId, clickElementByTestId, delay, waitForElementByTestId } from './helpers'

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

  test('has feed topic editors avatar pile.', async ({ page }) => {
    // make sure the feed contains the corresponding avatar pile for its editors
    await page.waitForSelector(byTestId('avatar-pile-open-modal-button'))
  })

  test('opens editors list upon clicking in avatar pile and shows topic editor cards.', async ({ page }) => {
    // TODO in https://holi.atlassian.net/browse/HOLI-1942
    // await page.waitForSelector(byTestId('avatar-pile-open-modal-button'))
    // await page.locator(byTestId('avatar-pile-open-modal-button')).first().click()
    // await delay(0.5) // wait for modal to open
    // await page.locator(byTestId('user-cards-modal-content'))
    // await page.locator(byTestId('user-card'))
  })
})
