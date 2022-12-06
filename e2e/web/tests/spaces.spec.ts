import { expect, test } from '@playwright/test'

import {
  checkAccessibility,
  clickElementByTestId,
  locateElementByTestId,
  waitForElementByInnerText,
  waitForElementByTestId,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/spaces')
  await expect.poll(() => page.url()).toContain('/spaces')
})

test.describe('@Spaces', () => {
  test('should be accessible from home screen', async ({ page }) => {
    await page.goto('/')
    await clickElementByTestId(page, 'btn-to-spaces')

    await waitForElementByTestId(page, 'spaces-container')
    expect(page.url()).toContain('/spaces')
  })

  test('should display multiple topics with spaces', async ({ page }) => {
    const countTopics = async () => await (await locateElementByTestId(page, 'spaces-topic-container')).count()
    const countSpaces = async () => await (await locateElementByTestId(page, 'btn-to-space')).count()

    await waitForElementByTestId(page, 'spaces-container')

    await expect.poll(countTopics, { timeout: 10000 }).toBeGreaterThan(1)
    await expect.poll(countSpaces, { timeout: 10000 }).toBeGreaterThan(1)

    await checkAccessibility(page)
  })

  test('should go to filtered spaces page and display multiple spaces with that filter', async ({ page }) => {
    await clickElementByTestId(page, 'spaces-topic-container-see-more')

    // check if there is at least one space card (button to space)
    await waitForElementByTestId(page, 'btn-to-space')

    await checkAccessibility(page)
  })

  test('should display space details', async ({ page }) => {
    await waitForElementByTestId(page, 'spaces-container')
    // click first element on page
    await clickElementByTestId(page, 'btn-to-space')

    await waitForElementByTestId(page, 'space-details-container')

    await waitForElementByTestId(page, 'space-header')

    await waitForElementByTestId(page, 'space-avatar')

    await waitForElementByTestId(page, 'space-title')

    await waitForElementByTestId(page, 'space-members')

    await waitForElementByTestId(page, 'space-description')

    await checkAccessibility(page)

    const spaceUrlPrefix = '/spaces/'
    expect(page.url()).toContain(spaceUrlPrefix)
  })
})
