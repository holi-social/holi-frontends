import Helper from '@codeceptjs/helper'

class NavigationHelper extends Helper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(config: any) {
    super(config)
  }

  async navigateBackToHomeScreen() {
    const { SelectorHelper } = this.helpers

    let homeScreenReached = false
    while (!homeScreenReached) {
      try {
        await SelectorHelper.seeElementWithTestId('home-feed-topics-heading')
        console.log('#### home!')
        homeScreenReached = true
      } catch (e) {
        console.log('not home', e)
        try {
          await SelectorHelper.tapOnElementWithTestId('nav-button-home')
          console.log('tapped home')
        } catch (e) {
          console.log('could not tap home', e)
          await SelectorHelper.tapOnElementWithTestId('nav-button-back')
          console.log('tapped back')
        }
      }
    }
  }
}

export = NavigationHelper
