import { continueAsGuest, logout } from '../../helpers/auth'
import { navigateBackToHomeScreen } from '../../helpers/navigation'
import { scrollToElementWithTestId, tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

describe('@HomeScreen_journey', () => {
  afterEach(async () => {
    // Speeds up local execution
    if (target === 'local') {
      await logout()
    }
  })

  it('should support the user journey', async () => {
    await continueAsGuest()

    await assertShowsInsights()

    await assertShowInsightsScreen()

    await assertShowsAppUpdates('goodnews')
  })
})

const assertShowsInsights = async () => {
  // go home
  await navigateBackToHomeScreen()

  await waitForElementWithTestId('home-feed-insights-heading')

  // go to insight screen
  await scrollToElementWithTestId('feed-insight-image-link', 'down')
  await tapOnElementWithTestId('feed-insight-image-link')

  await waitForElementWithTestId('insight-headline')

  // go home
  await navigateBackToHomeScreen('nav-button-back')
}

const assertShowInsightsScreen = async () => {
  // navigate to insights screen
  await scrollToElementWithTestId('btn-navigate-to-insights', 'down')
  await tapOnElementWithTestId('btn-navigate-to-insights')

  // expect insights page
  await waitForElementWithTestId('insights-page')

  await navigateBackToHomeScreen()
}

const assertShowsAppUpdates = async (app: string) => {
  // check if donation updates are displayed
  await scrollToElementWithTestId(`${app}-reco-slider-card`, 'down')
  // await waitForElementWithTestId(`${app}-reco-slider-heading`)

  // click first element in ScrollView
  await tapOnElementWithTestId(`${app}-reco-slider-card`)

  // expect detail view
  await waitForElementWithTestId(`${app}-detailview-container`)

  // await navigateBackToHomeScreen()
  await navigateBackToHomeScreen('nav-button-back')
}
