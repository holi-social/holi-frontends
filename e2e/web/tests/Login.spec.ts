import { test } from '@playwright/test'

import { byTestId } from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Login', () => {
  test('should work with valid credentials', async ({ page }) => {
    await page.locator(byTestId('profile-button')).waitFor()
    await page.locator(byTestId('profile-button')).click()
    await page.waitForSelector(byTestId('login-button'))
    await page.locator(byTestId('login-button')).click()
    await page.waitForSelector(byTestId('ory-submit-method'))
    await page.locator(byTestId('ory-input-identifier-input')).fill(process.env.E2E_USER_USERNAME || 'empty')
    await page.locator(byTestId('ory-input-password-input')).fill(process.env.E2E_USER_PASSWORD || 'empty')
    await page.locator(byTestId('ory-submit-method')).click()
    await page.waitForSelector(byTestId('logout-button'))
    await page.waitForSelector(byTestId('edit-button'))
  })

  test('should not work with invalid credentials', async ({ page }) => {
    await page.locator(byTestId('profile-button')).waitFor()
    await page.locator(byTestId('profile-button')).click()
    await page.waitForSelector(byTestId('login-button'))
    await page.locator(byTestId('login-button')).click()
    await page.waitForSelector(byTestId('ory-input-identifier-input'))
    await page.locator(byTestId('ory-input-identifier-input')).fill('asfd@asdf.de')
    await page.locator(byTestId('ory-input-password-input')).fill('1234')
    await page.locator(byTestId('ory-submit-method')).click()
    // see https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
    // for more ory error codes
    await page.locator(byTestId('ory-message-4000006')).waitFor()
  })
})
