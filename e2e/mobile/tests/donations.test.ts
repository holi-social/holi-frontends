import { waitForHomeScreen } from '../helpers/navigation'
import {
  fillFieldByTestId,
  locateMultipleElementsWithTestId,
  pressEnter,
  scrollToElementWithTestId,
  seeTextWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../helpers/selectors'

const navigateToDonationsApp = async () => {
  await waitForHomeScreen()
  await tapOnElementWithTestId('home-apps-button')
  await tapOnElementWithTestId('app-tile-donations')
  await waitForElementWithTestId('donations-list-container')
}

const extractResultCount = async (testId: string): Promise<number> => {
  const element = await waitForElementWithTestId(testId)
  const textContent = await element.getText()
  const numberMatch = textContent?.match(/\d+/)
  if (numberMatch && numberMatch.length) {
    return parseInt(numberMatch[0], 10)
  }
  return 0
}

const filterForLocation = async (location: string) => {
  // open search modal
  await tapOnElementWithTestId('donations-search-button')

  // enter location
  await fillFieldByTestId('donations-search-location-input', location)

  // submit form
  // Not using suggestions here, as they can not be easily identified and selected
  await pressEnter('donations-search-location-input')

  // wait for results
  await waitForElementWithTestId('donations-list-container')
}

const resetFilterInModal = async () => {
  // open search modal
  await tapOnElementWithTestId('donations-search-button')

  // close keyboard
  await tapOnElementWithTestId('donations-search-modal')

  // reset filter
  await tapOnElementWithTestId('donations-search-form-reset')

  // close search modal
  await tapOnElementWithTestId('donations-search-modal-close-btn')

  // wait for results
  await waitForElementWithTestId('donations-list-container')
}

describe('@Donations', () => {
  beforeEach(async () => {
    await navigateToDonationsApp()
  })

  afterEach(async () => {
    // Speeds up local execution
    if (target === 'local') {
      // navigate back
      await scrollToElementWithTestId('nav-button-back', 'up')
      await tapOnElementWithTestId('nav-button-back', 0)
    }
  })

  it('should display multiple projects', async () => {
    // listItems only contains elements visible in viewport
    const listItems = await locateMultipleElementsWithTestId('donations-list-item')
    expect(listItems.length).toBeGreaterThan(1)
  })

  it('should allow pagination', async () => {
    // scroll to button and count elements in viewport
    await scrollToElementWithTestId('btn-donation-list-load-more', 'down', { maxAttempts: 10 })
    const listItemsBefore = await locateMultipleElementsWithTestId('donations-list-item')

    // load more
    await tapOnElementWithTestId('btn-donation-list-load-more')

    // wait until "load more" button has been replaced by next list item
    await waitForElementWithTestIdToBeNull('btn-donation-list-load-more')

    // expect more elements in viewport than before (as the button has been pushed down)
    const listItemsAfter = await locateMultipleElementsWithTestId('donations-list-item')
    expect(listItemsAfter.length).toBeGreaterThan(listItemsBefore.length)
  })

  it('should display project details', async () => {
    // click first element in list
    await tapOnElementWithTestId('donations-list-item')

    await waitForElementWithTestId('donations-project-detail-heading')

    await waitForElementWithTestId('donations-project-detail-donate-btn')
    await waitForElementWithTestId('donations-project-initiative-btn')
  })

  it('should filter donations by location', async () => {
    // filter for "Germany"
    await filterForLocation('Germany')

    // assert results
    await seeTextWithTestId('Germany', 'donations-list-search-heading')
    const resultCountGermany = await extractResultCount('donations-list-search-summary')
    expect(resultCountGermany).toBeGreaterThan(0)

    // filter for "Hamburg"
    await filterForLocation('Hamburg')

    // assert and compare results
    await seeTextWithTestId('Hamburg', 'donations-list-search-heading')
    const resultCountHamburg = await extractResultCount('donations-list-search-summary')
    expect(resultCountHamburg).toBeGreaterThan(0)
    expect(resultCountHamburg).toBeLessThan(resultCountGermany)
  })

  it('should reset donations filter from list', async () => {
    // filter for "Germany"
    await filterForLocation('Germany')

    // assert results
    await seeTextWithTestId('Germany', 'donations-list-search-heading')
    const resultCountGermany = await extractResultCount('donations-list-search-summary')
    expect(resultCountGermany).toBeGreaterThan(0)

    // reset filter in list
    await tapOnElementWithTestId('donations-list-search-reset')

    // assert reset
    expect(await waitForElementWithTestId('donations-list-unfiltered'))
  })

  it('should reset donations filter from modal', async () => {
    // filter for "Germany"
    await filterForLocation('Germany')

    // assert results
    await seeTextWithTestId('Germany', 'donations-list-search-heading')
    const resultCountGermany = await extractResultCount('donations-list-search-summary')
    expect(resultCountGermany).toBeGreaterThan(0)

    // reset filter in modal
    await resetFilterInModal()

    // assert reset
    await waitForElementWithTestId('donations-list-unfiltered')
  })

  it('should display details of filter results', async () => {
    // filter for "Hamburg"
    await filterForLocation('Hamburg')

    // expect filtered list
    await seeTextWithTestId('Hamburg', 'donations-list-search-heading')

    // click first element in list
    await tapOnElementWithTestId('donations-list-item')

    // expect detail view
    await waitForElementWithTestId('donations-project-detail-heading')

    // navigate back
    await scrollToElementWithTestId('nav-button-back', 'up')
    await tapOnElementWithTestId('nav-button-back')

    // expect filtered list
    await seeTextWithTestId('Hamburg', 'donations-list-search-heading')
  })
})
