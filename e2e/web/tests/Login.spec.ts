import { test } from '@playwright/test'

import { selectorByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Login', () => {
  test('should work with valid credentials', async ({ page }) => {
    await page.waitForSelector('text="Home"')
    await page.locator(selectorByTestId('profile-button')).click()
    await page.waitForSelector('text="Login"')
    await page.locator('text="Login"').click()
    await page.waitForSelector('text="ID"')
    await page.waitForSelector('data-testid=field/identifier')
    await page.locator('data-testid=field/identifier').fill(process.env.E2E_USER_USERNAME || '')
    await page.locator('data-testid=field/password').fill(process.env.E2E_USER_PASSWORD || '')
    await page.click('text=Sign in')
    await page.waitForSelector('text="Profile"')
  })

  test('should not work with invalid credentials', async ({ page }) => {
    await page.waitForSelector('text="Home"')
    await page.locator(selectorByTestId('profile-button')).click()
    await page.waitForSelector('text="Login"')
    await page.locator('text="Login"').click()
    await page.waitForSelector('text="ID"')
    await page.waitForSelector('data-testid=field/identifier')
    await page.locator('data-testid=field/identifier').fill('asdf@asdf.asdf')
    await page.locator('data-testid=field/password').fill('asdf')
    await page.click('text=Sign in')
    // see https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
    // for more ory error codes
    await page.locator('data-testid=message/4000006').waitFor
  })
})
