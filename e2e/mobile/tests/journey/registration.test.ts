import { faker } from '@faker-js/faker'

import { register } from '../../helpers/auth'
import { tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

describe('@Registration - journey', () => {
  const email = `${faker.internet.userName()}${faker.string.numeric(4)}@e2etest.com`
  const password = 'TheSamePassword4A11E2eUsers'

  it('validates Email and password fields', async () => {
    // no password and no email
    await register({ email: '', password: '' }, false)

    await waitForElementWithTestId('ory-traits-email-input-error-message')
    await waitForElementWithTestId('ory-password-input-error-message')

    await tapOnElementWithTestId('btn-to-continue-as-guest')

    // invalid email provided
    await register({ email: '', password }, false)
    await waitForElementWithTestId('ory-traits-email-input-error-message')

    await tapOnElementWithTestId('btn-to-continue-as-guest')

    // short password provided
    await register({ email, password: 'Sh0rt' }, false)
    await waitForElementWithTestId('ory-password-input-error-message')

    await tapOnElementWithTestId('btn-to-continue-as-guest')

    // weak password provided
    await register({ email, password: '11111111' }, false)
    await waitForElementWithTestId('ory-password-input-error-message')

    await tapOnElementWithTestId('btn-to-continue-as-guest')
  })
})
