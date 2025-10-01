import { expect } from '@playwright/test'

import { newUserEmail, randomPassword } from '@holi/e2e-web/tests/helpers/fixtures'

import { test } from './testmaster'

test.describe('@ChangePassword', () => {
  test('user journey', async ({ sessions }) => {
    const email = newUserEmail()
    const oldPassword = randomPassword()
    const newPassword = randomPassword()

    const { page } = await sessions.signUp(email, oldPassword)
    page.goto('/profile')

    await page.getByRole('button', { name: 'Settings' }).click()
    await page.getByRole('button', { name: 'Your account' }).click()
    await page.getByRole('button', { name: 'Change password' }).click()

    // provide invalid old password
    await page.getByRole('textbox', { name: 'Old password' }).fill('wrongOldPassword')
    await page.getByRole('textbox', { name: 'New password' }).fill(newPassword)
    await page.getByRole('button', { name: 'Change password' }).click()

    await expect(page.getByTestId('old-password-input-error-message')).toHaveText('The password does not match')

    // provide invalid new password
    await page.getByRole('textbox', { name: 'Old password' }).fill(oldPassword)
    await page.getByRole('textbox', { name: 'New password' }).fill('1234')
    await page.getByRole('button', { name: 'Change password' }).click()

    await expect(page.getByTestId('new-password-input-error-message')).toHaveText(
      /The password must be at least 8 characters long/
    )

    // FIXME: Re-Enable after ORY is fixed
    // // provide correct passwords
    // await (await locateElementByTestId(page, 'old-password-input')).fill(oldPassword)
    // await (await locateElementByTestId(page, 'new-password-input')).fill(newPassword)
    // await clickElementByTestIdAndWaitForToastFinish(page, 'btn-submit-change-password', 'toast-SUCCESS')

    // // Logout
    // await clickElementByTestId(page, 'btn-to-settings')
    // await clickElementByTestId(page, 'btn-to-logout')
    // await clickElementByTestIdAndWaitForToast(page, 'modal-logout-confirmation-primary', 'toast-SUCCESS')

    // // re-login with new password
    // await gotoFillAndSubmitLogin(context, page, email, newPassword)
    // await page.waitForSelector(byTestId('user-profile-full-name'))
  })
})
