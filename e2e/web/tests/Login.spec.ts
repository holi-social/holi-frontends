import { test } from '@playwright/test'

import { selectorByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Login', () => {
  test('should work with valid credentials', async ({ page }) => {
    await page.locator(selectorByTestId('profile-button')).waitFor()
    await page.locator(selectorByTestId('profile-button')).click()
    await page.waitForSelector(selectorByTestId('login-button'))
    await page.locator(selectorByTestId('login-button')).click()
    await page.waitForSelector(selectorByTestId('oryField-identifier-input'))
    await page.locator(selectorByTestId('oryField-identifier-input')).fill(process.env.E2E_USER_USERNAME || '')
    await page.locator(selectorByTestId('oryField-password-input')).fill(process.env.E2E_USER_PASSWORD || '')
    await page.locator(selectorByTestId('oryField-method/password')).click()
    await page.waitForSelector('text="Profile"')
  })

  test('should not work with invalid credentials', async ({ page }) => {
    await page.locator(selectorByTestId('profile-button')).waitFor()
    await page.locator(selectorByTestId('profile-button')).click()
    await page.waitForSelector(selectorByTestId('login-button'))
    await page.locator(selectorByTestId('login-button')).click()
    await page.waitForSelector(selectorByTestId('oryField-identifier-input'))
    await page.locator(selectorByTestId('oryField-identifier-input')).fill('asfd@asdf.de')
    await page.locator(selectorByTestId('oryField-password-input')).fill('1234')
    await page.locator(selectorByTestId('oryField-method/password')).click()
    // see https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
    // for more ory error codes
    await page.locator('data-testid=message/4000006').waitFor
  })
})
