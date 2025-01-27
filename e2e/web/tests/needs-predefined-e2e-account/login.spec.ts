import { byTestId, checkAccessibility, clickElementByTestId, login, loginAsE2EUser } from '../helpers'
import { test } from '../testmaster'

test.describe('@Login', () => {
  test('fails for invalid credentials', async ({ context, page }) => {
    await login(context, page, 'asfd@asdf.de', '1234')
    // see https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
    // for more ory error codes
    await page.waitForSelector(byTestId('toast-message-4000006'))
    await checkAccessibility(page)
  })

  test('works with valid credentials', async ({ context, page }) => {
    await loginAsE2EUser(context, page)
    // login form is gone
    await page.waitForSelector(byTestId('btn-to-forgot-password-form'), { state: 'detached' })

    // and can log out
    await clickElementByTestId(page, 'btn-to-profile-view')
    await clickElementByTestId(page, 'btn-to-settings')
    await clickElementByTestId(page, 'btn-to-logout')
    await page.getByRole('button', { name: 'Log out' }).click()
  })
})
