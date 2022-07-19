
import { type Page, test } from '@playwright/test'
import { selectorByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('The Home Screen', () => {
  test('should work', async ({ page }) => {
    await page.waitForSelector('text="Topic of the day"')
    await page.waitForSelector('text="This week’s topics are Immigration, Education and Sustainability"')
    await page.locator(selectorByTestId('app-tile-volunteering')).click()

    await page.waitForSelector('text="Lets Act"')
    await page.locator(selectorByTestId('nav-button-home')).click()

    await page.waitForSelector('text="Topic of the day"')
  })
})

