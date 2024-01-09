import { scrollUp } from '@holi/e2e-mobile/helpers/gestures'
import { delay } from '@holi/e2e-mobile/helpers/time'

import {
  elementByTestId,
  elementExists,
  getElement,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
} from './selectors'

const homeScreenTestId = 'home-feed-insights-heading'

export const waitForHomeScreen = async () => await getElement(homeScreenTestId)

export const navigateToAppById = async (id: 'donations' | 'goodnews' | 'volunteering') => {
  await waitForHomeScreen()
  await tapOnElementWithTestId('home-apps-button')
  await tapOnElementWithTestId(`app-tile-${id}`)
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
  while (!homeScreenReached) {
    if (await elementExists('btn-to-home-view')) {
      await tapOnElementWithTestId('btn-to-home-view')
    }
    const backButtonOverlay = await elementByTestId('nav-button-back')
    if (backButtonOverlay.elementId) {
      // swipe a bit downwards to have the back button header overlay return into view
      await scrollUp()
      await Appium.touchAction({ element: backButtonOverlay, action: 'tap' })
      // wait for the animation to finish
      await delay(2)
    }

    if (await elementExists(homeScreenTestId)) {
      homeScreenReached = true
    }
  }
}

// this implementation allows for deeper/infinite nesting of pages/layers
// todo gregor: replace with method above
export const navigateBackToHomeScreenDeeper = async () => {
  try {
    // early exit: are we already on it?
    await waitForHomeScreen()
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
