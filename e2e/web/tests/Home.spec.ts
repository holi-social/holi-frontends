
import { type Page, test } from '@playwright/test'
import { selectorByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('The Home Screen', () => {
  test('should work', async ({ page }) => {
    await page.waitForSelector('text="Home"')
    await page.waitForSelector('text="This week’s topics are Immigration, Education and Sustainability"')
    await page.locator(selectorByTestId('app-tile-volunteering')).click()

    await page.waitForSelector('text="Volunteering App Home"')
    await page.locator(selectorByTestId('nav-button-home')).click()

    await page.waitForSelector('text="Home"')
  })
})

