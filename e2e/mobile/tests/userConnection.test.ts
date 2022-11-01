import { faker } from '@faker-js/faker'

import { defaultAuthSteps } from '../helpers/auth'
import { navigateBackToHomeScreen } from '../helpers/navigation'
import { scrollToElementWithTestId, tapOnElementWithTestId, waitForElementWithTestId } from '../helpers/selectors'

describe('@UserConnection', () => {
  const email = `${faker.internet.userName()}${faker.random.numeric(4)}@e2etest.com`
  const password = 'TheSamePassword4A11E2eUsers'

  it('should request connection from another user profile page and then cancel it', async () => {
    // create a new user
    await defaultAuthSteps({ email, password }, 'registration')

    // go home
    await navigateBackToHomeScreen()

    // user suggestions element should be visible
    await scrollToElementWithTestId('user-suggestions', 'down', { maxAttempts: 5 })

    // tap on first user in list
    await scrollToElementWithTestId('user-card-suggestion-0', 'down', { maxAttempts: 5 })
    await tapOnElementWithTestId('user-card-suggestion-0')

    // for the newly created user, the button state should be NOT_CONNECTED
    await tapOnElementWithTestId('user-connection-button-NOT_CONNECTED')

    // after clicked, the button state should change to REQUESTED
    await waitForElementWithTestId('user-connection-button-REQUESTED')

    // clicking the button again, should trigger the confirm dialog
    await tapOnElementWithTestId('user-connection-button-REQUESTED')

    // click on confirm within the confirmation dialog and wait for NOT_CONNECTED state
    await tapOnElementWithTestId('user-connection-confirmation-confirm')

    // the connection button state should be back to NOT_CONNECTED
    await waitForElementWithTestId('user-connection-button-NOT_CONNECTED')
  })
})
