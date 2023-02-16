import { defaultAuthSteps } from '../../helpers/auth'
import { scrollDown } from '../../helpers/gestures'
import { navigateBackToHomeScreen } from '../../helpers/navigation'
import {
  locateMultipleElementsWithTestId,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../../helpers/selectors'

describe('@HomeScreen', () => {
  it('should support the user journey', async () => {
    await assertShowsInsights()

    await assertAllowsPagination()

    await assertShowsAppUpdates('donations')

    await assertShowsAppUpdates('goodnews')

    await assertShowsAppUpdates('volunteering')

    await assertShowsNoUserSuggestionsWhenLoggedOut()

    await assertShowsUserSuggestionsWhenLoggedIn()
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

  // go home
  await navigateBackToHomeScreen('nav-button-back')
}

const assertAllowsPagination = async () => {
  const listItemsBefore = await locateMultipleElementsWithTestId('feed-insight-image-link')
  // load more
  await scrollToElementWithTestId('btn-insights-list-load-more', 'down')
  await tapOnElementWithTestId('btn-insights-list-load-more')
  // wait until "load more" button has been replaced by next list item
  await waitForElementWithTestIdToBeNull('btn-insights-list-load-more')
  // expect more elements in viewport than before (as the button has been pushed down)
  const listItemsAfter = await locateMultipleElementsWithTestId('feed-insight-image-link')
  expect(listItemsAfter.length).toBeGreaterThan(listItemsBefore.length)
}

const assertShowsAppUpdates = async (app: string) => {
  // check if donation updates are displayed
  await scrollToElementWithTestId(`${app}-updates-item`, 'down')
  // await waitForElementWithTestId(`${app}-updates-heading`)

  // click first element in ScrollView
  await tapOnElementWithTestId(`${app}-updates-item`)

  // expect detail view
  await waitForElementWithTestId(`${app}-detailview-container`)

  // await navigateBackToHomeScreen()
  await navigateBackToHomeScreen('nav-button-back')
}

const assertShowsNoUserSuggestionsWhenLoggedOut = async () => {
  // scroll to bottom (swipe up, opposite direction)
  await scrollDown()

  // user suggestions element should be null when logged out
  await waitForElementWithTestIdToBeNull('user-suggestions')
}

const assertShowsUserSuggestionsWhenLoggedIn = async () => {
  // login
  await defaultAuthSteps()

  // go home
  await navigateBackToHomeScreen('btn-to-home-view')

  // scroll down to user suggestions element should be visible
  await scrollToElementWithTestId('user-suggestions', 'down', { maxAttempts: 5 })
}
