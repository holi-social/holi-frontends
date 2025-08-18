import { randomPassword } from '@holi/e2e-web/tests/helpers/fixtures'

import { byTestId, checkAccessibility, clickElementByTestId, registerUser } from './helpers'
import { test } from './testmaster'
import type { OnboardingUserData } from '@holi/core/screens/onboarding/types'

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
    const userData: OnboardingUserData = {
      location: {
        label: 'Hamburg, Germany',
        id: '51223999b85500244059f052ea9271c64a40f00101f9013ef5000000000000c00208',
      },
      interests: ['animal-welfare', 'climate-environment'],
      skills: ['arts-crafts', 'fundraising'],
    }

    await userHandler.asRandomUser(
      async (page) => {
        await test.step('profiles profile tab shows topics and skills', async () => {
          if (userData.location?.label) {
            await page.getByText(userData.location?.label).isVisible()
          }

          await clickElementByTestId(page, 'profile-tabs-button-profile-inactive')

          await page.waitForSelector(byTestId('interests--animal-welfare'))
          await page.waitForSelector(byTestId('interests--climate-environment'))

          await page.waitForSelector(byTestId('skills--arts-crafts'))
          await page.waitForSelector(byTestId('skills--fundraising'))
        })
      },
      { userData }
    )
  })
})
