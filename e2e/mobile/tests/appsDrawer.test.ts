import {
  tapOnElementWithTestId,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../helpers/selectors'

describe('@AppsDrawer', () => {
  it('should be visible and opens drawer', async () => {
    // find and click apps button
    await waitForElementWithTestId('home-apps-button')
    await tapOnElementWithTestId('home-apps-button')

    // apps drawer is open and contain apps
    await waitForElementWithTestId('app-tile-donations')

    // open an app
    await tapOnElementWithTestId('app-tile-donations')

    // app is open, apps button has disappeared and drawer is gone
    await waitForElementWithTestId('donations-list-container')
    await waitForElementWithTestIdToBeNull('home-apps-button')

    // go back home and see apps button again
    await tapOnElementWithTestId('nav-button-back')
    await waitForElementWithTestId('home-apps-button')
  })
})
