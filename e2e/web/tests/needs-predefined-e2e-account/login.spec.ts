import { expect, test } from '@playwright/test'

import { byTestId, login, loginAsE2EUser } from '../helpers'

test.describe('@Login', () => {
  test('should not login when credentials are invalid', async ({ page }) => {
    await login(page, 'asfd@asdf.de', '1234')
    // see https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
    // for more ory error codes
    await page.waitForSelector(byTestId('toast-message-4000006'))
  })

  test('should login when credentials are valid', async ({ page }) => {
    await loginAsE2EUser(page)

    await expect(page.getByLabel('Bottom navigation').getByText('Me')).toBeVisible()
  })
})
