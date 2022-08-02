import { Page, test } from '@playwright/test'
import { checkA11y, injectAxe } from 'axe-playwright'

import { byTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await injectAxe(page)
})

const checkAccessibility = async (page: Page) => {
  const options = {
    rules: {
      region: { enabled: true }, // https://dequeuniversity.com/rules/axe/4.4/region
    },
  }

  if ('axe' in window === false) {
    await injectAxe(page)
  }

  await checkA11y(page, options)
}

test.describe('Accessibility', () => {
  test('should work', async ({ page }) => {
    await page.waitForSelector(byTestId('home-feed-topics-heading'))
    await checkAccessibility(page)

    await page.locator(byTestId('btn-to-profile-view')).click()
    await page.waitForSelector(byTestId('user-profile-logged-out-heading'))
    await checkAccessibility(page)

    await page.locator(byTestId('nav-button-home')).click()
    await page.waitForSelector(byTestId('home-feed-topics-heading')) // this weeks topics
    await checkAccessibility(page)

    await page.locator(byTestId('app-tile-volunteering')).click()
    await page.waitForSelector(byTestId('apps-volunteering-heading'))
    await checkAccessibility(page)
  })
})
