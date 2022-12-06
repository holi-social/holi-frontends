import { defaultAuthSteps } from '../../helpers/auth'
import { navigateBackToHomeScreen } from '../../helpers/navigation'
import {
  scroll,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../../helpers/selectors'

describe('@HomeScreen', () => {
  it('should support the user journey', async () => {
    await assertShowsInsights()

    await assertShowsDonationUpdates()

    await assertShowsNoUserSuggestionsWhenLoggedOut()

    await assertShowsUserSuggestionsWhenLoggedIn()

    // clean up, scroll up
    await scrollToElementWithTestId('home-feed-insights-heading', 'up', { maxAttempts: 5 })
  })
})

const assertShowsInsights = async () => {
  // go home
  await navigateBackToHomeScreen()

  await waitForElementWithTestId('home-feed-insights-heading')

  // go to insight screen
  await waitForElementWithTestId('feed-insight-image-link')
  await tapOnElementWithTestId('feed-insight-image-link')

  await waitForElementWithTestId('insight-headline')
}

const assertShowsDonationUpdates = async () => {
  // go home
  await navigateBackToHomeScreen()

  // check if donation updates are displayed
  await scrollToElementWithTestId('donations-updates-item', 'down')
  await waitForElementWithTestId('donations-updates-heading')

  // click first element in ScrollView
  await tapOnElementWithTestId('donations-updates-item')

  // expect detail view
  await waitForElementWithTestId('donations-project-detail-heading')
}

const assertShowsNoUserSuggestionsWhenLoggedOut = async () => {
  // go home
  await navigateBackToHomeScreen()

  // scroll to bottom
  await scroll('down', { repetitions: 5 })

  // user suggestions element should be null when logged out
  await waitForElementWithTestIdToBeNull('user-suggestions')
}

const assertShowsUserSuggestionsWhenLoggedIn = async () => {
  // login
  await defaultAuthSteps()

  // go home
  await navigateBackToHomeScreen()

  // scroll down to user suggestions element should be visible
  await scrollToElementWithTestId('user-suggestions', 'down', { maxAttempts: 5 })
}
