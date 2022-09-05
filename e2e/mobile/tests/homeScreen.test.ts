import { defaultAuthSteps } from '../helpers/auth'
import { navigateBackToHomeScreen } from '../helpers/navigation'
import { tapOnElementWithTestId, waitForElementWithTestId } from '../helpers/selectors'

describe('@HomeScreen', () => {
  it('should work', async () => {
    await waitForElementWithTestId('home-feed-topics-heading')

    // go to topic screen
    await waitForElementWithTestId('feed-topic-image-link')
    await tapOnElementWithTestId('feed-topic-image-link')

    await waitForElementWithTestId('topic-headline')

    // go home
    await navigateBackToHomeScreen()

    // open volunteering app
    await waitForElementWithTestId('app-tile-volunteering')
    await tapOnElementWithTestId('app-tile-volunteering')
    await waitForElementWithTestId('apps-volunteering-heading')

    // go home
    await navigateBackToHomeScreen()
  })

  it('should not show user suggestions if logged out', async () => {
    // logout
    await tapOnElementWithTestId('btn-to-profile-view')
    await tapOnElementWithTestId('btn-to-logout')
    await tapOnElementWithTestId('confirm-logout-button')

    // go home
    await navigateBackToHomeScreen()

    // user suggestions element should be null
    await waitForElementWithTestId('user-suggestions', 500, true)
  })

  it('should not show user suggestions if logged out', async () => {
    // login
    await defaultAuthSteps()

    // go home
    await navigateBackToHomeScreen()

    // user suggestions element should be null
    await waitForElementWithTestId('user-suggestions', 500, false)
  })
})
