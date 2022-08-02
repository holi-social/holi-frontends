import { type Page, test } from '@playwright/test'
import { byTestId, checkAccessibility } from './helpers'
 
const { checkA11y, injectAxe } = require('axe-playwright')


test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await injectAxe(page)
})

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