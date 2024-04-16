import { byTestId, clickElementByTestId, locateElementByTestId, newUserEmail, randomPassword } from './helpers'
import { test } from './testmaster'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.describe('@ChangePassword', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  test('user journey', async ({ userHandler, context }) => {
    const email = newUserEmail()
    const oldPassword = randomPassword()
    const newPassword = randomPassword()
    await userHandler.asRandomUser(
      async (page) => {
        // after the login we are on the profile page.
        await clickElementByTestId(page, 'btn-to-settings')
        await clickElementByTestId(page, 'btn-your-account')
        await clickElementByTestId(page, 'btn-change-password')

        // provide invalid old password
        await (await locateElementByTestId(page, 'old-password-input')).fill('wrongOldPassword')
        await (await locateElementByTestId(page, 'new-password-input')).fill(newPassword)
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
        // await clickElementByTestIdAndWaitForToast(page, 'modal-logout-confirmation-confirm', 'toast-SUCCESS')

        // // re-login with new password
        // await gotoFillAndSubmitLogin(context, page, email, newPassword)
        // await page.waitForSelector(byTestId('user-profile-full-name'))
      },
      email,
      oldPassword
    )
  })
})
