import { expect, test } from '@playwright/test'

import { byTestId } from './helpers'

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

    await page.goBack()

    await Promise.all([page.click(byTestId('feed-topic-contributors-link')), page.waitForNavigation()])
    expect(page.url()).toContain('topics/')
  })

  test('has feed topic curators avatar pile.', async ({ page }) => {
    // make sure the feed contains the corresponding avatar pile for its editors
    await page.waitForSelector(byTestId('feed-topic-contributors-link'))
  })

  test('opens curators list upon clicking in avatar pile.', async ({ page }) => {
    await page.waitForSelector(byTestId('feed-topic-contributors-link'))
    await page.locator(byTestId('feed-topic-contributors-link')).first().click()

    // correctly opens modal upon clicking the avatar pile
    await page.locator(byTestId('user-profile-modal-animatedview'))

    // find topic editor cards once modal is open
    await page.waitForSelector(byTestId('topic-editor-card'))
  })
})
