import {
  byTestId,
  clickElementByTestId,
  clickElementByTestIdAndWaitForToast,
  clickElementByTestIdAndWaitForToastFinish,
  gotoFillAndSubmitLogin,
  locateElementByTestId,
  newUserEmail,
  waitForElementByTestId,
} from './helpers'
import { test } from './testmaster'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.describe('@ChangePassword', () => {
  test('changes the password of a user.', async ({ userHandler, context }) => {
    const email = newUserEmail()
    const oldPassword = 'whgr88234298wohfffwo'
    const newPassword = 'dlrnrf82840wnfw4o538'
    await userHandler.asRandomUser(
      async (page) => {
        // after the login we are on the profile page.
        await clickElementByTestId(page, 'btn-to-settings')
        await clickElementByTestId(page, 'btn-your-account')
        await clickElementByTestId(page, 'btn-change-password')

        const oldPwdInput = await locateElementByTestId(page, 'old-password-input')
        await oldPwdInput.fill(oldPassword)
        const newPwdInput = await locateElementByTestId(page, 'new-password-input')
        await newPwdInput.fill(newPassword)

        await clickElementByTestIdAndWaitForToastFinish(page, 'btn-submit-change-password', 'toast-SUCCESS')

        // Logout
        await clickElementByTestId(page, 'btn-to-settings')
        await clickElementByTestId(page, 'btn-to-logout')
        await clickElementByTestIdAndWaitForToast(page, 'modal-logout-confirmation-confirm', 'toast-SUCCESS')

        await gotoFillAndSubmitLogin(context, page, email, newPassword)

        await waitForElementByTestId(page, 'btn-to-settings')
      },
      email,
      oldPassword
    )
  })
})
