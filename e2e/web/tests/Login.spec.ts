
import { type Page, test } from '@playwright/test'
import { selectorByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Login', () => {
  test('should work', async ({ page }) => {
    await page.waitForSelector('text="Home"')
    page.locator(selectorByTestId('profile-button')).click()
    await page.waitForSelector('text="Login"')
  })
})
