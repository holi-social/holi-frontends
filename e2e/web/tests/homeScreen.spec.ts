import { expect, test } from '@playwright/test'

import { byTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('The Home Screen', () => {
  test('should work', async ({ page }) => {
    await page.waitForSelector(byTestId('home-feed-topics-heading'))
    await page.locator(byTestId('app-tile-volunteering')).click()

    await page.waitForSelector('text="Volunteering"')
    await page.locator(byTestId('nav-button-home')).click()
  })

  test('has feed topic headline', async ({ page }) => {
    const feedTopicHeadline = await page.locator(byTestId('home-feed-topics-heading'))
    expect.soft(feedTopicHeadline).toHaveText(/This week’s topic/i)
  })

  test('has feed topic items and redirects to topic page if item gets clicked', async ({ page }) => {
    await page.locator(byTestId('feed-topic-image-link >> nth=1')).click()
    await page.waitForNavigation()
    expect(page.url()).toContain('/topics/')

    await page.goto('/')

    await page.locator(byTestId('feed-topic-contributors-link >> nth=1')).click()
    await page.waitForNavigation()
    expect(page.url()).toContain('/topics/')
  })
})
