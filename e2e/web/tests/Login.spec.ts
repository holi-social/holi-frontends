
import { type Page, test } from '@playwright/test'
import { selectorByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Login', () => {
  test('should work', async ({ page }) => {
    await page.waitForSelector('text="Home"')
    await page.locator(selectorByTestId('profile-button')).click()
    await page.waitForSelector('text="Login"')
    await page.locator(selectorByTestId('data-testid="field/identifer"')).fill('e2etest@holistic.foundation')
    await page.fill('input[data-testid="field/password"]', 'projectholi2022')
    await page.click('text=Submit')
  })
})
