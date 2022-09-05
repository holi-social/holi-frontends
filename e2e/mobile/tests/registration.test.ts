import { faker } from '@faker-js/faker'

import { defaultAuthSteps } from '../helpers/auth'
import { tapOnElementWithTestId, waitForElementWithTestId } from '../helpers/selectors'

describe('@Login', () => {
  const email = `${faker.internet.userName()}${faker.random.numeric(4)}@e2etest.com`
  const password = 'TheSamePassword4A11E2eUsers'

  it('validate Email and password fields', async () => {
    // no password and no email
    await defaultAuthSteps({ email: '', password: '' }, 'registration')

    await waitForElementWithTestId('ory-traits-email-input-error-message')
    await waitForElementWithTestId('ory-password-input-error-message')

    // invalid email provided
    await defaultAuthSteps({ email: '', password }, 'registration')
    await waitForElementWithTestId('ory-traits-email-input-error-message')

    // short password provided
    await defaultAuthSteps({ email, password: 'Sh0rt' }, 'registration')
    await waitForElementWithTestId('ory-password-input-error-message')

    // weak password provided
    await defaultAuthSteps({ email, password: '11111111' }, 'registration')
    await waitForElementWithTestId('ory-password-input-error-message')
  })

  it('Registration - Logout', async () => {
    // successful registration
    await defaultAuthSteps({ email, password }, 'registration')

    await waitForElementWithTestId('btn-to-profile-view')

    // logout
    await tapOnElementWithTestId('btn-to-profile-view')
    await tapOnElementWithTestId('btn-to-logout')
    await tapOnElementWithTestId('confirm-logout-button')

    // try to create a new user with the same credentials
    await defaultAuthSteps({ email, password }, 'registration')

    await waitForElementWithTestId('ory-message-4000007')
  })
})
