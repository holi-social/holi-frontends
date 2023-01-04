import { scrollToElementWithTestId, tapOnElementWithTestId, waitForElementWithTestId } from './selectors'

const homeScreenTestId = 'home-feed-insights-heading'

export const waitForHomeScreen = async (timeout?: number) => waitForElementWithTestId(homeScreenTestId, timeout)

export const navigateToAppById = async (id: 'donations' | 'goodnews' | 'volunteering') => {
  await waitForHomeScreen()
  await tapOnElementWithTestId('home-apps-button')
  await tapOnElementWithTestId(`app-tile-${id}`)
  await waitForElementWithTestId(`${id}-list-container`)
}

// TODO decide on single implementation
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
        await scrollToElementWithTestId(homeScreenTestId, 'up', { maxAttempts: 5 })
      } catch (e) {
        await tapOnElementWithTestId('nav-button-back', 0)
        await scrollToElementWithTestId(homeScreenTestId, 'up', { maxAttempts: 5 })
      }
    }
  }
}

// this implementation allows for deeper/infinite nesting of pages/layers
export const navigateBackToHomeScreenDeeper = async () => {
  try {
    // early exit: are we already on it?
    await waitForHomeScreen(1)
    return
  } catch (e) {
    // not there yet, continue
    try {
      let count = 0
      // first press any back buttons we can find
      // eslint-disable-line no-constant-condition
      while (++count < 10) {
        await tapOnElementWithTestId('nav-button-back', 5000)
      }
    } catch (e) {
      try {
        // then go to the home screen
        await tapOnElementWithTestId('btn-to-home-view', 5000)
      } catch (e) {
        // all fine: if the button is not there, we should be already on the home screen
      }
      await scrollToElementWithTestId(homeScreenTestId, 'up', { maxAttempts: 20 })
    }
  }
}
