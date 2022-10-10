import { scrollToElementWithTestId, tapOnElementWithTestId, waitForElementWithTestId } from './selectors'

export const waitForHomeScreen = async (timeout?: number) =>
  waitForElementWithTestId('home-feed-topics-heading', timeout)

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
        await tapOnElementWithTestId('nav-button-home', 0)
        await scrollToElementWithTestId('home-feed-topics-heading', 'up')
      } catch (e) {
        await tapOnElementWithTestId('nav-button-back', 0)
        await scrollToElementWithTestId('home-feed-topics-heading', 'up')
      }
    }
  }
}
