import { scrollToElementWithTestId, tapOnElementWithTestId, waitForElementWithTestId } from './selectors'

const homeScreenTestId = 'home-feed-insights-heading'

export const waitForHomeScreen = async (timeout?: number) => waitForElementWithTestId(homeScreenTestId, timeout)

export const navigateToAppById = async (id: 'donations' | 'goodnews' | 'volunteering') => {
  await waitForHomeScreen()
  await tapOnElementWithTestId('btn-to-act')
  await scrollToElementWithTestId(`${id}-reco-slider-heading-button`, 'down')
  await tapOnElementWithTestId(`${id}-reco-slider-heading-button`)
  await waitForElementWithTestId(`${id}-list-container`)
}

type backHomeButtonId = 'btn-to-home-view' | 'nav-button-back'

// TODO decide on single implementation
// If back button is known, pass buttonId as an argument, otherwise enter while loop until homeScreen is reached
export const navigateBackToHomeScreen = async (buttonId?: backHomeButtonId) => {
  if (buttonId) {
    return await tapOnElementWithTestId(buttonId, 0)
  }

  let homeScreenReached = false
  let firstRun = true
  while (!homeScreenReached) {
    try {
      await waitForHomeScreen(firstRun ? 500 : 5000)
      homeScreenReached = true
    } catch (e) {
      firstRun = false
      try {
        await tapOnElementWithTestId('btn-to-home-view', 0)
      } catch (e) {
        await tapOnElementWithTestId('nav-button-back', 0)
      }
      await scrollToElementWithTestId(homeScreenTestId, 'up', { maxAttempts: 15 })
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

export const navigateBackFromAppScreen = async () => {
  await scrollToElementWithTestId('nav-button-back', 'up')
  await tapOnElementWithTestId('nav-button-back', 0)
}
