import { expect } from '@playwright/test'
import { checkAccessibility } from './helpers'
import { test } from './testmaster'

test.describe('@ForgotPassword', () => {
  test('user journey', async ({ page }) => {
    await page.goto('/forgotPassword')

    await page.getByRole('button', { name: 'Verify email' }).click()
    await expect(page.getByTestId('ory-email-input-error-message')).toHaveText('Please enter your email address')

    // reset form by reloading, so error message disappears
    await page.goto('/forgotPassword')

    // invalid email message
    await page.getByLabel('Email', { exact: true }).fill('an invalid email')
    await page.getByRole('button', { name: 'Verify email' }).click()
    await expect(page.getByTestId('ory-email-input-error-message')).toHaveText(
      "This doesn't seem to be an email address. Please correct your input."
    )

    await checkAccessibility(page)

    // successful form submission
    await page.getByLabel('Email', { exact: true }).fill('valid@mail.de')
    await page.getByRole('button', { name: 'Verify email' }).click()

    // code input view is shown
    await expect(page.getByRole('textbox', { name: 'Code Field' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Submit Code' })).toBeVisible()
  })
})
