import {
  fillFieldByTestId,
  locateMultipleElementsWithTestId,
  scrollToElementWithTestId,
  seeTextWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../helpers/selectors'

const navigateToDonationsApp = async () => {
  await waitForElementWithTestId('home-feed-insights-heading')
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

  const extractResultCount = async (testId: string): Promise<number> => {
    const element = await waitForElementWithTestId(testId)
    const textContent = await element.getText()
    const numberMatch = textContent?.match(/\d+/)
    if (numberMatch && numberMatch.length) {
      return parseInt(numberMatch[0], 10)
    }
    return 0
  }

  test('should filter donations by location', async () => {
    // open search modal
    await tapOnElementWithTestId('donations-search-button')

    // enter location Germany
    await fillFieldByTestId('donations-search-location-input', 'Germany')
    // close keyboard
    await tapOnElementWithTestId('donations-search-modal')
    // close search modal
    await tapOnElementWithTestId('donations-search-modal-close-btn')
    // wait for results
    await waitForElementWithTestId('donations-list-container')

    // assert results
    await seeTextWithTestId('Germany', 'donations-list-search-heading')
    const resultCountGermany = await extractResultCount('donations-list-search-summary')
    expect(resultCountGermany).toBeGreaterThan(0)

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

    // assert and compare results
    await seeTextWithTestId('Hamburg', 'donations-list-search-heading')
    const resultCountHamburg = await extractResultCount('donations-list-search-summary')
    expect(resultCountHamburg).toBeGreaterThan(0)
    expect(resultCountHamburg).toBeLessThan(resultCountGermany)
  })
})
