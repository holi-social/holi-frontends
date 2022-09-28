import { expect, test } from '@playwright/test'

import { byTestId, clickElementByTestId, defaultAuthSteps, waitForElementByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('@HomeScreen', () => {
  test('has feed topic headline', async ({ page }) => {
    await waitForElementByTestId(page, 'home-feed-topics-heading')
  })

  test('has feed topic items and clicking them leads to overview page.', async ({ page }) => {
    await Promise.all([
      page.waitForNavigation({ url: '**/topics/**' }),
      clickElementByTestId(page, 'feed-topic-image-link'),
    ])
    expect(page.url()).toContain('/topics/')
  })

  test('has feed topic editors avatar pile.', async ({ page }) => {
    // make sure the feed contains the corresponding avatar pile for its editors
    await page.waitForSelector(byTestId('avatar-pile-open-modal-button'))
  })

  test('opens editors list upon clicking in avatar pile and shows topic editor cards.', async ({ page }) => {
    await page.waitForSelector(byTestId('avatar-pile-open-modal-button'))
    await page.locator(byTestId('avatar-pile-open-modal-button')).first().click()
    await page.locator(byTestId('user-cards-modal-content'))
    await page.locator(byTestId('user-card'))
  })

  test('shows no user suggestions if logged out.', async ({ page }) => {
    await expect(await page.locator(byTestId('user-suggestions'))).toHaveCount(0)
  })

  test('shows 10 user suggestions if logged in.', async ({ page, context }) => {
    await defaultAuthSteps({ page, context })
    await page.locator(byTestId('nav-button-home')).click()
    await page.waitForSelector(byTestId('user-suggestions'))
    expect(await page.locator(byTestId('user-card-suggestion'))).toHaveCount(10)
  })
})
