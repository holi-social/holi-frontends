import { faker } from '@faker-js/faker'

import { deleteAccount, register, registerNewUser, testIdContinueAsGuest } from '../../helpers/auth'
import { tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

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
    // Register with simplified onboarding flow
    await registerNewUser({ userData: true })

    // Expect being redirected to home feed
    await waitForHomeScreen()

    // Navigate to profile
    await tapOnElementWithTestId('btn-to-profile-view')

    // Simplified onboarding no longer sets location, interests, or skills
    // Just verify profile screen is accessible

    await deleteAccount()
  })
})
