import { defaultAuthSteps, logout } from '../../helpers/auth'
import { navigateBackToHomeScreen } from '../../helpers/navigation'
import {
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../../helpers/selectors'

describe('@HomeScreen', () => {
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
    await scrollToElementWithTestId('user-suggestions', 'down', { maxAttempts: 5 })

    // clean up view
    await logout()
    await scrollToElementWithTestId('home-feed-insights-heading', 'up', { maxAttempts: 3 })
  })

  it('should display donation updates', async () => {
    // check if donation updates are displayed
    await scrollToElementWithTestId('donations-updates-item', 'down')
    await waitForElementWithTestId('donations-updates-heading')

    // click first element in ScrollView
    await tapOnElementWithTestId('donations-updates-item')

    // expect detail view
    await waitForElementWithTestId('donations-project-detail-heading')

    // go home
    await navigateBackToHomeScreen()
  })
})
