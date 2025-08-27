import { randomPassword } from '@holi/e2e-web/tests/helpers/fixtures'

import { byTestId, checkAccessibility, registerUser } from './helpers'
import { test } from './testmaster'

test.describe('@Registration', () => {
  test('should not be able to register with invalid credentials', async ({ context, page }) => {
    const validPassword = randomPassword()
    const validEmail = 'foobar@barbaz.de'

    // no password and email provided
    await registerUser(context, page, { email: '', password: '' })
    await page.waitForSelector(byTestId('ory-traits-email-input-error-message'))
    await page.waitForSelector(byTestId('ory-password-input-error-message'))
    await checkAccessibility(page)

    // invalid email provided
    await registerUser(context, page, { email: '!!!wrong@', password: validPassword })
    await page.waitForSelector(byTestId('ory-traits-email-input-error-message'))

    // short password provided
    await registerUser(context, page, { email: validEmail, password: 'Sh0rt' })
    await page.waitForSelector(byTestId('ory-password-input-error-message'))

    // weak password provided
    await registerUser(context, page, { email: validEmail, password: '11111111' })
    await page.waitForSelector(byTestId('ory-password-input-error-message'))
  })

  test('should be able to register with valid credentials', async ({ userHandler }) => {
    //FIXME: Error: Wasn't able to intercept user id while finishing account setup flow at finishAccountSetup in appointmentNotifications.spec.ts
    // using a random user session implicitly tests user registration
    await userHandler.asRandomUser(async (page) => {
      // Starting on profile page
      // Ensure user is logged in
      await page.waitForSelector(byTestId('user-profile-full-name'))

      // trying to go to login page with logged in user should show home feed
      await page.goto('/login')
      await page.waitForSelector(byTestId('home-feed-listing'))
    })
  })

  test('should perform full onboarding', async ({ userHandler }) => {
    // Simplified onboarding flow

    await userHandler.asRandomUser(
      async (page) => {
        await test.step('profile screen is accessible after simplified onboarding', async () => {
          await page.goto('/profile/settings/aboutMe')

          // Simplified onboarding no longer sets interests or skills
          // Just verify the profile settings page loads
          await page.waitForSelector(byTestId('profile-settings'))
        })
      },
      { userData: true }
    )
  })
})
