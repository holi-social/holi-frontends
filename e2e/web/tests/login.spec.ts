import { test } from '@playwright/test'
import { injectAxe } from 'axe-playwright'

import { checkAccessibility, clickElementByTestId, defaultLoginSteps, waitForElementByTestId } from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await injectAxe(page)
})

test.describe('@Login', () => {
  test('Login - Logout', async ({ page }) => {
    // should not work with invalid credentials
    await defaultLoginSteps({ page, username: 'asfd@asdf.de', password: '1234' })
    // see https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
    // for more ory error codes
    await waitForElementByTestId(page, 'ory-message-4000006')
    await checkAccessibility(page)
    await page.goto('/')

    // should work with valid credentials
    // Login
    await defaultLoginSteps({ page })
    // Logout
    await clickElementByTestId(page, 'btn-to-logout')
    await clickElementByTestId(page, 'confirm-logout-button')
    await waitForElementByTestId(page, 'btn-to-login-form')
  })
})
