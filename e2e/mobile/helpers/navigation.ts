import { seeElementWithTestId, tapOnElementWithTestId } from './selectors'

export const navigateBackToHomeScreen = async () => {
  let homeScreenReached = false
  while (!homeScreenReached) {
    try {
      // TODO(SF) improve, make quicker
      await seeElementWithTestId('home-feed-topics-heading', 0)
      console.log('#### home!')
      homeScreenReached = true
    } catch (e) {
      console.log('not home', e)
      try {
        await tapOnElementWithTestId('nav-button-home')
        console.log('tapped home')
      } catch (e) {
        console.log('could not tap home', e)
        await tapOnElementWithTestId('nav-button-back')
        console.log('tapped back')
      }
    }
  }
}
