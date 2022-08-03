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
})
