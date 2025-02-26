import { byTestId, checkAccessibility, clickElementByTestId, clickFirstElement, locateElementByTestId } from './helpers'
import { test } from './testmaster'

test.describe('@ForgotPassword', () => {
  test('user journey', async ({ page }) => {
    await page.goto('/')

    await clickElementByTestId(page, 'btn-to-onboarding')

    const loginLink = (await locateElementByTestId(page, 'already-have-account-text')).getByRole('link')
    await clickFirstElement(loginLink)

    const forgotPasswordLink = page.getByText('I forgot my password')
    await clickFirstElement(forgotPasswordLink)

    const emailInput = await locateElementByTestId(page, 'ory-email-input')
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
    await page.waitForSelector(byTestId('ory-email-input'), { state: 'detached' })
  })
})
