import { defaultAuthSteps, logout } from '../helpers/auth'
import { navigateBackToHomeScreen } from '../helpers/navigation'
import {
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../helpers/selectors'

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
    // go home
    await navigateBackToHomeScreen()

    // user suggestions element should be null
    await waitForElementWithTestIdToBeNull('user-suggestions')
  })

  it('should show user suggestions if logged in', async () => {
    // login
    await defaultAuthSteps()

    // go home
    await navigateBackToHomeScreen()

    // scorll down to user suggestions element should be visible
    await scrollToElementWithTestId('user-suggestions', 'down')

    // logout
    await logout()
  })
})
