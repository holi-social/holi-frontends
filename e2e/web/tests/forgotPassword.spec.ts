import { expect, test } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  delay,
  locateElementByTestId,
  waitForElementByTestId,
} from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('@ForgotPassword', () => {
  test('ForgotPassword form validation', async ({ page }) => {
    await clickElementByTestId(page, 'btn-to-profile-view')
    await clickElementByTestId(page, 'btn-to-login-form')
    await clickElementByTestId(page, 'btn-to-forgot-password-form')

    // shows also login link
    await waitForElementByTestId(page, 'btn-to-login-form')

    // shows also registration link
    await waitForElementByTestId(page, 'btn-to-registration-form')

    // form validation ...
    const emailInput = await locateElementByTestId(page, 'ory-email-input')

    // required field message
    await clickElementByTestId(page, 'ory-submit-method')
    await waitForElementByTestId(page, 'ory-email-input-error-message')
    delay(10)

    // invalid email message
    await emailInput.fill('an-invalid-email')
    await clickElementByTestId(page, 'ory-submit-method')
    await waitForElementByTestId(page, 'ory-email-input-error-message')
  })

  test('ForgotPassword successful form submission', async ({ page }) => {
    await waitForElementByTestId(page, 'home-feed-topics-heading')
    await checkAccessibility(page)

    await clickElementByTestId(page, 'btn-to-profile-view')
    await clickElementByTestId(page, 'btn-to-login-form')
    await clickElementByTestId(page, 'btn-to-forgot-password-form')

    // shows also login link
    await waitForElementByTestId(page, 'btn-to-login-form')

    // shows also registration link
    await waitForElementByTestId(page, 'btn-to-registration-form')

    // form validation ...
    const emailInput = await locateElementByTestId(page, 'ory-email-input')

    // successful form submission
    await emailInput.fill('valid@mail.de')
    await clickElementByTestId(page, 'ory-submit-method')

    // success view is shown
    await waitForElementByTestId(page, 'form-sent-headline')
    await waitForElementByTestId(page, 'back-to-home-btn')

    // input is not visible anymore
    await expect(await emailInput.isVisible()).not.toBeTruthy()
    // await page.waitForSelector(byTestId('ory-email-input'), { state: 'detached' })
    expect(await page.locator(byTestId('ory-email-input')).isVisible()).not.toBeTruthy()
  })
})
