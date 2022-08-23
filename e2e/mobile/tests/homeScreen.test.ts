import { tapOnElementWithTestId, waitForElementWithTestId } from '../helpers/selectors'

describe('@HomeScreen', () => {
  it('should work', async () => {
    await waitForElementWithTestId('home-feed-topics-heading')

    await tapOnElementWithTestId('app-tile-volunteering')
    await waitForElementWithTestId('apps-volunteering-heading')

    await tapOnElementWithTestId('nav-button-home')
    await waitForElementWithTestId('home-feed-topics-heading')
  })
})
