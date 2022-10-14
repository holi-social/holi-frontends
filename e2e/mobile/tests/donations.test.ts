import {
  fillFieldByTestId,
  locateMultipleElementsWithTestId,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../helpers/selectors'

const navigateToDonationsApp = async () => {
  await waitForElementWithTestId('home-feed-topics-heading')
  await tapOnElementWithTestId('home-apps-button')
  await tapOnElementWithTestId('app-tile-donations')
  await waitForElementWithTestId('donations-list-container')
}

describe('@Donations', () => {
  beforeEach(async () => {
    await navigateToDonationsApp()
  })

  it('should display multiple projects', async () => {
    // listItems only contains elements visible in viewport
    const listItems = await locateMultipleElementsWithTestId('donations-list-item')
    expect(listItems.length).toBeGreaterThan(1)
  })

  test('should allow pagination', async () => {
    // scroll to button and count elements in viewport
    await scrollToElementWithTestId('btn-donation-list-load-more', 'down', { maxAttempts: 5 })
    const listItemsBefore = await locateMultipleElementsWithTestId('donations-list-item')

    // load more
    await tapOnElementWithTestId('btn-donation-list-load-more')

    // wait until "load more" button has been replaced by next list item
    await waitForElementWithTestIdToBeNull('btn-donation-list-load-more')

    // expect more elements in viewport than before (as the button has been pushed down)
    const listItemsAfter = await locateMultipleElementsWithTestId('donations-list-item')
    expect(listItemsAfter.length).toBeGreaterThan(listItemsBefore.length)
  })

  test('should display project details', async () => {
    // click first element in list
    await tapOnElementWithTestId('donations-list-item')

    await waitForElementWithTestId('donations-project-detail-heading')

    await waitForElementWithTestId('donations-project-detail-donate-btn')
    await waitForElementWithTestId('donations-project-initiative-btn')
  })

  test('should filter donations by location', async () => {
    // open search modal
    await tapOnElementWithTestId('donations-search-button')

    // enter location
    await fillFieldByTestId('donations-search-location-input', 'Hamburg')
    // close keyboard
    await tapOnElementWithTestId('donations-search-modal')
    // close search modal
    await tapOnElementWithTestId('donations-search-modal-close-btn')
    // wait for results
    await waitForElementWithTestId('donations-list-container')
    await waitForElementWithTestId('donations-list-search-heading')
    await waitForElementWithTestId('donations-list-search-summary')
  })
})
