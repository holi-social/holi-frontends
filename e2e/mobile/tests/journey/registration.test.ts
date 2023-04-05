import { faker } from '@faker-js/faker'

import { defaultAuthSteps } from '../../helpers/auth'
import { navigateBackToHomeScreen } from '../../helpers/navigation'
import { itif } from '../../helpers/platform'
import { waitForElementWithTestId } from '../../helpers/selectors'

const goFromRegistrationToHome = async () => {
  await navigateBackToHomeScreen('btn-to-home-view')
}

describe('@Registration - journey', () => {
  const email = `${faker.internet.userName()}${faker.random.numeric(4)}@e2etest.com`
  const password = 'TheSamePassword4A11E2eUsers'

  itif(platform !== 'ios', 'validates Email and password fields', async () => {
    // no password and no email
    await defaultAuthSteps({ email: '', password: '' }, 'registration', false)

    await waitForElementWithTestId('ory-traits-email-input-error-message')
    await waitForElementWithTestId('ory-password-input-error-message')

    await goFromRegistrationToHome()

    // invalid email provided
    await defaultAuthSteps({ email: '', password }, 'registration', false)
    await waitForElementWithTestId('ory-traits-email-input-error-message')

    await goFromRegistrationToHome()

    // short password provided
    await defaultAuthSteps({ email, password: 'Sh0rt' }, 'registration', false)
    await waitForElementWithTestId('ory-password-input-error-message')

    await goFromRegistrationToHome()

    // weak password provided
    await defaultAuthSteps({ email, password: '11111111' }, 'registration', false)
    await waitForElementWithTestId('ory-password-input-error-message')

    await goFromRegistrationToHome()
  })
})
