import { faker } from '@faker-js/faker'

import { deleteAccount, register, registerNewUser, testIdContinueAsGuest } from '../../helpers/auth'
import {
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithInnerText,
  waitForElementWithTestId,
} from '../../helpers/selectors'
import type { OnboardingUserData } from '@holi/core/screens/onboarding/types'
import { waitForHomeScreen } from '@holi/e2e-mobile/helpers/navigation'

describe('@RegistrationJourney', () => {
  const email = `${faker.internet.userName()}${faker.string.numeric(4)}@e2etest.com`
  const password = 'TheSamePassword4A11E2eUsers'

  it('validates Email and password fields', async () => {
    // no password and no email
    await register({ email: '', password: '', skipAccountSetup: true })

    await waitForElementWithTestId('ory-traits-email-input-error-message')
    await waitForElementWithTestId('ory-password-input-error-message')

    await tapOnElementWithTestId(testIdContinueAsGuest)

    // invalid email provided
    await register({ email: '', password, skipAccountSetup: true })
    await waitForElementWithTestId('ory-traits-email-input-error-message')

    await tapOnElementWithTestId(testIdContinueAsGuest)

    // short password provided
    await register({ email, password: 'Sh0rt', skipAccountSetup: true })
    await waitForElementWithTestId('ory-password-input-error-message')

    await tapOnElementWithTestId(testIdContinueAsGuest)

    // weak password provided
    await register({ email, password: '11111111', skipAccountSetup: true })
    await waitForElementWithTestId('ory-password-input-error-message')

    await tapOnElementWithTestId(testIdContinueAsGuest)
  })

  it('performs full onboarding', async () => {
    // Register filling out user data in onboarding
    const userData: OnboardingUserData = {
      location: {
        label: 'Hamburg, Germany',
        id: '51223999b85500244059f052ea9271c64a40f00101f9013ef5000000000000c00208',
      },
      interests: ['animal-welfare', 'climate-environment'],
      skills: ['arts-crafts', 'fundraising'],
    }
    await registerNewUser({ userData })

    // Expect being redirected to home feed
    await waitForHomeScreen()

    // Navigate to profile
    await tapOnElementWithTestId('btn-to-profile-view')

    // Expect location
    if (userData.location?.label) await waitForElementWithInnerText(userData.location?.label)

    // Expect interests
    await scrollToElementWithTestId('user-profile-interests', 'down')
    for (const slug of userData.interests) {
      await waitForElementWithTestId(`interests--${slug}`)
    }

    // Expect skills
    await scrollToElementWithTestId('user-profile-skills', 'down')
    for (const slug of userData.skills) {
      await waitForElementWithTestId(`skills--${slug}`)
    }

    await deleteAccount()
  })
})
