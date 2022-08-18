import { tapOnElementWithTestId, waitForElementWithTestId } from './selectors'

export const waitForHomeScreen = async (timeout?: number) =>
  waitForElementWithTestId('home-feed-topics-heading', timeout)

export const navigateBackToHomeScreen = async () => {
  let homeScreenReached = false
  let firstRun = true
  while (!homeScreenReached) {
    try {
      await waitForHomeScreen(firstRun ? 0 : 2000)
      homeScreenReached = true
    } catch (e) {
      if (firstRun) {
        firstRun = false
        console.debug('navigating back to home screen')
      }
      try {
        await tapOnElementWithTestId('nav-button-home', 0)
      } catch (e) {
        await tapOnElementWithTestId('nav-button-back', 0)
      }
    }
  }
}
