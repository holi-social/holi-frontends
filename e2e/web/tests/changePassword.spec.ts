import { newUserEmail, randomPassword } from '@holi/e2e-web/tests/helpers/fixtures'

import { byTestId, checkAccessibility, clickElementByTestId, locateElementByTestId } from './helpers'
import { test } from './testmaster'

test.describe('@ChangePassword', () => {
  test('user journey', async ({ sessions }) => {
    const email = newUserEmail()
    const oldPassword = randomPassword()
    const newPassword = randomPassword()

    const { page } = await sessions.signUp(email, oldPassword)
    page.goto('/profile')

    await clickElementByTestId(page, 'btn-to-settings')
    await clickElementByTestId(page, 'btn-your-account')
    await clickElementByTestId(page, 'btn-change-password')

    // provide invalid old password
    await (await locateElementByTestId(page, 'old-password-input')).fill('wrongOldPassword')
    await (await locateElementByTestId(page, 'new-password-input')).fill(newPassword)
    await checkAccessibility(page)
    await clickElementByTestId(page, 'btn-submit-change-password')
    await page.waitForSelector(byTestId('old-password-input-error-message'))

    // provide invalid new password
    await (await locateElementByTestId(page, 'old-password-input')).fill(oldPassword)
    await (await locateElementByTestId(page, 'new-password-input')).fill('1234')
    await clickElementByTestId(page, 'btn-submit-change-password')
    await page.waitForSelector(byTestId('new-password-input-error-message'))

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
