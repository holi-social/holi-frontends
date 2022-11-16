import { scrollToElementWithTestId, tapOnElementWithTestId, waitForElementWithTestId } from './selectors'

const homeScreenTestId = 'home-feed-insights-heading'

export const waitForHomeScreen = async (timeout?: number) => waitForElementWithTestId(homeScreenTestId, timeout)

export const navigateBackToHomeScreen = async () => {
  let homeScreenReached = false
  let firstRun = true
  while (!homeScreenReached) {
    try {
      await waitForHomeScreen(firstRun ? 0 : 5000)
      homeScreenReached = true
    } catch (e) {
      if (firstRun) {
        firstRun = false
      }
      try {
        await tapOnElementWithTestId('btn-to-home-view', 0)
        await scrollToElementWithTestId(homeScreenTestId, 'up')
      } catch (e) {
        await tapOnElementWithTestId('nav-button-back', 0)
        await scrollToElementWithTestId(homeScreenTestId, 'up')
      }
    }
  }
}
