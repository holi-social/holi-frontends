import { deleteAccount, registerNewUser } from '../../helpers/auth'
import { navigateBackToHomeScreen } from '../../helpers/navigation'
import { scrollToElementWithTestId, tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

describe('@UserConnection', () => {
  it('should request connection from another user profile page and then cancel it', async () => {
    // create a new user
    await registerNewUser()

    // go home
    await navigateBackToHomeScreen()

    // user suggestions element should be visible
    await scrollToElementWithTestId('user-suggestions', 'down')

    // tap on first user in list
    await scrollToElementWithTestId('user-card-suggestion-0', 'down', { maxAttempts: 3 })
    await tapOnElementWithTestId('user-card-suggestion-0')

    // for the newly created user, the button state should be NOT_CONNECTED
    await tapOnElementWithTestId('user-connection-button-NOT_CONNECTED')

    // after clicked, the button state should change to REQUESTED
    await waitForElementWithTestId('user-connection-button-REQUESTED')

    // clicking the button again, should trigger the confirm dialog
    await tapOnElementWithTestId('user-connection-button-REQUESTED')

    // click on confirm within the confirmation dialog and wait for NOT_CONNECTED state
    await tapOnElementWithTestId('user-connection-confirmation-primary')

    // the connection button state should be back to NOT_CONNECTED
    await waitForElementWithTestId('user-connection-button-NOT_CONNECTED')

    await navigateBackToHomeScreen()

    // clean up view
    await deleteAccount()
    await navigateBackToHomeScreen()
  })
})
