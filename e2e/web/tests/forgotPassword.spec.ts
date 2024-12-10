import { expect } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  clickFirstElement,
  dismissConsentDialog,
  locateElementByTestId,
} from './helpers'
import { test } from './testmaster'

test.describe('@ForgotPassword', () => {
  test('user journey', async ({ page }) => {
    await page.goto('/')
    await dismissConsentDialog(page)
    const loginLink = (await locateElementByTestId(page, 'already-have-account-text')).getByRole('link')
    await clickFirstElement(loginLink)
    const forgotPasswordLink = (await locateElementByTestId(page, 'btn-to-forgot-password-form')).getByRole('link')
    await clickFirstElement(forgotPasswordLink)

    // shows also login link
    await page.waitForSelector(byTestId('already-have-account-text'))

    // shows also registration link
    await page.waitForSelector(byTestId('btn-to-registration-form'))

    // form validation ...
    const emailInput = await locateElementByTestId(page, 'ory-email-input')

    // required field message
    await clickElementByTestId(page, 'ory-submit-code')
    await page.waitForSelector(byTestId('ory-email-input-error-message'))

    // reset form by reloading, so error message disappears
    await page.goto('/forgotPassword')
    // invalid email message
    await emailInput.fill('an-invalid-email')
    await clickElementByTestId(page, 'ory-submit-code')
    await page.waitForSelector(byTestId('ory-email-input-error-message'))

    await checkAccessibility(page)

    // successful form submission
    await emailInput.fill('valid@mail.de')
    await clickElementByTestId(page, 'ory-submit-code')

    // code input view is shown
    await page.waitForSelector(byTestId('email-verification-code-input'))
    await page.waitForSelector(byTestId('btn-submit-code'))
    await page.waitForSelector(byTestId('nav-button-back'))

    // input is not visible anymore
    await expect(await emailInput.isVisible()).not.toBeTruthy()
    // await page.waitForSelector(byTestId('ory-email-input'), { state: 'detached' })
    expect(await page.locator(byTestId('ory-email-input')).isVisible()).not.toBeTruthy()
  })
})
