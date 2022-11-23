import { expect, test } from '@playwright/test'

import { checkAccessibility, clickElementByTestId, locateElementByTestId, waitForElementByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/spaces')
})

test.describe('@Spaces', () => {
  test('should be accessible from home screen', async ({ page }) => {
    await page.goto('/')
    await clickElementByTestId(page, 'btn-to-spaces')

    await waitForElementByTestId(page, 'spaces-container')
    expect(page.url()).toContain('/spaces')
  })

  test('should display multiple topics with spaces', async ({ page }) => {
    await waitForElementByTestId(page, 'spaces-container')
    const topics = await locateElementByTestId(page, 'spaces-topic-container')
    expect(await topics.count()).toBeGreaterThan(1)
    const spaces = await locateElementByTestId(page, 'btn-to-space')
    expect(await spaces.count()).toBeGreaterThan(1)

    await checkAccessibility(page)
  })

  test('should display space details', async ({ page }) => {
    await waitForElementByTestId(page, 'spaces-container')
    // click first element on page
    await clickElementByTestId(page, 'btn-to-space')

    await waitForElementByTestId(page, 'space-details-container')

    await checkAccessibility(page)

    const spaceUrlPrefix = '/spaces/'
    expect(page.url()).toContain(spaceUrlPrefix)
  })
})
