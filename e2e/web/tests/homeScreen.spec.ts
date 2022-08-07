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

    await page.goBack()

    const editorsLinkId = 'feed-topic-contributors-link'
    const editorsHeadlineId = 'feed-topic-editors-headline'
    await clickElementByTestId(page, editorsLinkId)
    // Await modal animation > improve!
    await delay(0.5)
    if (!(await page.isVisible(byTestId(editorsHeadlineId)))) {
      await clickElementByTestId(page, editorsLinkId)
    }
    await waitForElementByTestId(page, editorsHeadlineId)
  })
})
