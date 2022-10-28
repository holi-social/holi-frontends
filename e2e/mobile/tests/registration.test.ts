import { faker } from '@faker-js/faker'

import { defaultAuthSteps, logout } from '../helpers/auth'
import { tapOnElementWithTestId, waitForElementWithTestId } from '../helpers/selectors'

const goFromRegistrationToHome = async () => {
  await tapOnElementWithTestId('nav-button-back')
  await tapOnElementWithTestId('nav-button-home')
}

describe('@Registration', () => {
  const email = `${faker.internet.userName()}${faker.random.numeric(4)}@e2etest.com`
  const password = 'TheSamePassword4A11E2eUsers'

  it('validates Email and password fields', async () => {
    // no password and no email
    await defaultAuthSteps({ email: '', password: '' }, 'registration')

    await waitForElementWithTestId('ory-traits-email-input-error-message')
    await waitForElementWithTestId('ory-password-input-error-message')

    await goFromRegistrationToHome()

    // invalid email provided
    await defaultAuthSteps({ email: '', password }, 'registration')
    await waitForElementWithTestId('ory-traits-email-input-error-message')

    await goFromRegistrationToHome()

    // short password provided
    await defaultAuthSteps({ email, password: 'Sh0rt' }, 'registration')
    await waitForElementWithTestId('ory-password-input-error-message')

    await goFromRegistrationToHome()

    // weak password provided
    await defaultAuthSteps({ email, password: '11111111' }, 'registration')
    await waitForElementWithTestId('ory-password-input-error-message')

    await goFromRegistrationToHome()
  })

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
