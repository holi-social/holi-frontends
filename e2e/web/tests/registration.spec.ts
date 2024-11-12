import { randomPassword } from '@holi/e2e-web/tests/helpers/fixtures'

import { byTestId, checkAccessibility, registerUser } from './helpers'
import { test } from './testmaster'

test.describe('@Registration', () => {
  test('should not be able to register with invalid credentials', async ({ context, page }) => {
    const validPassword = randomPassword()
    const validEmail = 'foobar@barbaz.de'

    // no password and email provided
    await registerUser(context, page, '', '')
    await page.waitForSelector(byTestId('ory-traits-email-input-error-message'))
    await page.waitForSelector(byTestId('ory-password-input-error-message'))
    await checkAccessibility(page)

    // invalid email provided
    await registerUser(context, page, '!!!wrong@', validPassword)
    await page.waitForSelector(byTestId('ory-traits-email-input-error-message'))

    // short password provided
    await registerUser(context, page, validEmail, 'Sh0rt')
    await page.waitForSelector(byTestId('ory-password-input-error-message'))

    // weak password provided
    await registerUser(context, page, validEmail, '11111111')
    await page.waitForSelector(byTestId('ory-password-input-error-message'))
  })

  test('should be able to register with valid credentials', async ({ userHandler }) => {
    //FIXME: Error: Wasn't able to intercept user id while finishing account setup flow at finishAccountSetup in appointmentNotifications.spec.ts
    // using a random user session implicitly tests user registration
    await userHandler.asRandomUser(async (page) => {
      // BUG: test-id: user-profile-full-name is not available on the page we are rendering. It is available on /profile. If that is intended behaviour, uncomment the next line
      // await page.goto('/profile')
      await page.waitForSelector(byTestId('user-profile-full-name'))

      // trying to go to login page with logged in user should show home feed
      await page.goto('/login')
      await page.waitForSelector(byTestId('home-feed-insights-heading'))
    })
  })
})
