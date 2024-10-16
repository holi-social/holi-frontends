import { byTestId, checkAccessibility, clickElementByTestId, login, loginAsE2EUser } from './helpers'
import { test } from './testmaster'

test.describe('@Login', () => {
  test('Login - Logout', async ({ context, page }) => {
    // should not work with invalid credentials
    await login(context, page, 'asfd@asdf.de', '1234')
    // see https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
    // for more ory error codes
    await page.waitForSelector(byTestId('toast-message-4000006'))
    await checkAccessibility(page)
    // reset form by reloading the page
    await page.goto('/')

    // should work with valid credentials
    // Login
    await loginAsE2EUser(context, page)
    // Logout
    await clickElementByTestId(page, 'btn-to-profile-view')
    await clickElementByTestId(page, 'btn-to-settings')
    await clickElementByTestId(page, 'btn-to-logout')
    await page.getByRole('button', { name: 'Log out' }).click()
    await page.waitForSelector(byTestId('anonymous-profile-login-btn'))
  })
})
