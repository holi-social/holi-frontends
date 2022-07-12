import { type Page, test } from '@playwright/test'
import { selectorByTestId } from './helpers'
 
const { checkA11y, injectAxe } = require('axe-playwright')


test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await injectAxe(page)
})

async function checkAccessibility(page: Page) {
  const options = {
    rules: {
      region: { enabled: true }, // https://dequeuniversity.com/rules/axe/4.4/region
    },
  }
  await checkA11y(page, options)
}

test.describe('Accessibility', () => {
  test('should work', async ({ page }) => {
    await page.waitForSelector('h1')
    await checkAccessibility(page)

    await page.locator(selectorByTestId('profile-button')).click()
    await page.waitForSelector('h2')
    await checkAccessibility(page)

    await page.locator(selectorByTestId('nav-button-home')).click()
    await page.waitForSelector('h1')
    await checkAccessibility(page)

    await page.locator(selectorByTestId('app-tile-volunteering')).click()
    await page.waitForSelector('h1')
    await checkAccessibility(page)
  })
})