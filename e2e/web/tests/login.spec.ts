import { test } from '@playwright/test'

import { checkAccessibility, clickElementByTestId, defaultAuthSteps, waitForElementByTestId } from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('@Login', () => {
  test('Login - Logout', async ({ context, page }) => {
    // should not work with invalid credentials
    await defaultAuthSteps({ context, page, email: 'asfd@asdf.de', password: '1234' })
    // see https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
    // for more ory error codes
    await waitForElementByTestId(page, 'toast-message-4000006')
    await checkAccessibility(page)
    await page.goto('/')

    // should work with valid credentials
    // Login
    await defaultAuthSteps({ context, page })
    // Logout
    await clickElementByTestId(page, 'btn-to-logout')
    await clickElementByTestId(page, 'confirm-logout-button')
    await waitForElementByTestId(page, 'btn-to-login-form')
  })
})
