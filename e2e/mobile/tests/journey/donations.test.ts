import { waitForHomeScreen } from '../../helpers/navigation'
import {
  fillFieldByTestId,
  locateMultipleElementsWithTestId,
  pressEnter,
  scrollToElementWithTestId,
  seeTextWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../../helpers/selectors'

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

  it('should do many things', async () => {
    // scroll to button and count elements in viewport
    await scrollToElementWithTestId('btn-donation-list-load-more', 'down', { maxAttempts: 10 })
    const listItemsBefore = await locateMultipleElementsWithTestId('donations-list-item')
    // it should display multiple projects
    expect(listItemsBefore.length).toBeGreaterThan(1)

    // load more
    await tapOnElementWithTestId('btn-donation-list-load-more')

    // wait until "load more" button has been replaced by next list item
    await waitForElementWithTestIdToBeNull('btn-donation-list-load-more')

    // expect more elements in viewport than before (as the button has been pushed down)
    const listItemsAfter = await locateMultipleElementsWithTestId('donations-list-item')
    // it should allow pagination
    expect(listItemsAfter.length).toBeGreaterThan(listItemsBefore.length)

    // it should display project details
    await tapOnElementWithTestId('donations-list-item')
    await waitForElementWithTestId('donations-project-detail-heading')
    await waitForElementWithTestId('donations-project-detail-donate-btn')
    await waitForElementWithTestId('donations-project-initiative-btn')

    await scrollToElementWithTestId('nav-button-back', 'up')
    await tapOnElementWithTestId('nav-button-back', 0)

    // it should filter donations by location
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

    // reset filter in list
    await tapOnElementWithTestId('donations-list-search-reset')
    // it should reset donations filter from list
    expect(await waitForElementWithTestId('donations-list-unfiltered'))

    // it should display details of filter results
    // filter for "Germany"
    await filterForLocation('Hamburg')
    // click first element in list
    await tapOnElementWithTestId('donations-list-item')
    // expect detail view
    await waitForElementWithTestId('donations-project-detail-heading')
    // navigate back
    await scrollToElementWithTestId('nav-button-back', 'up')
    await tapOnElementWithTestId('nav-button-back')
    // expect filtered list
    await seeTextWithTestId('Hamburg', 'donations-list-search-heading')

    // it should reset donations filter from modal
    await resetFilterInModal()
    // assert reset
    await waitForElementWithTestId('donations-list-unfiltered')
  })
})
