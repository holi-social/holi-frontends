import {
  locateMultipleElementsWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
} from '../helpers/selectors'

describe('@Donations', () => {
  it('should be accessible from home screen', async () => {
    await waitForElementWithTestId('home-feed-topics-heading')
    await tapOnElementWithTestId('app-tile-donations')

    await waitForElementWithTestId('donations-list-container')
  })

  it('should display multiple projects', async () => {
    // navigate to donations app
    await waitForElementWithTestId('home-feed-topics-heading')
    await tapOnElementWithTestId('app-tile-donations')
    await waitForElementWithTestId('donations-list-container')

    // listItems only contains elements visible in viewport
    const listItems = await locateMultipleElementsWithTestId('donations-list-item')
    expect(listItems.length).toBeGreaterThan(1)
  })
})
