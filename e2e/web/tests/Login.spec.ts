import { test } from '@playwright/test'

import { byTestId, defaultLoginSteps } from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Paths', () => {
  test('Login - Logout', async ({ page }) => {
    // should not work with invalid credentials
    await defaultLoginSteps({ page, username: 'asfd@asdf.de', password: '1234' })
    // see https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
    // for more ory error codes
    await page.locator(byTestId('ory-message-4000006')).waitFor()
    await page.goto('/')

    // should work with valid credentials
    // Login
    await defaultLoginSteps({ page })
    // Logout
    await page.locator(byTestId('btn-to-logout')).click()
    await page.locator(byTestId('confirm-logout-button')).click()
    await page.waitForSelector(byTestId('btn-to-login-form'))
  })
})
