import { faker } from '@faker-js/faker'

import { defaultAuthSteps, logout } from '../../helpers/auth'
import { tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

const goFromRegistrationToHome = async () => {
  await tapOnElementWithTestId('nav-button-back')
  await tapOnElementWithTestId('btn-to-home-view')
}

describe('@Registration', () => {
  const email = `${faker.internet.userName()}${faker.random.numeric(4)}@e2etest.com`
  const password = 'TheSamePassword4A11E2eUsers'

  it('Registration - Logout', async () => {
    // successful registration
    await defaultAuthSteps({ email, password }, 'registration')

    // logout
    await logout()

    // try to create a new user with the same credentials
    await defaultAuthSteps({ email, password }, 'registration')

    await waitForElementWithTestId('ory-traits-email-input-error-message')

    await goFromRegistrationToHome()
  })
})
