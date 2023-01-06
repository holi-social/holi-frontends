import { navigateToAppById } from '../../helpers/navigation'
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

describe('@Donations', () => {
  afterEach(async () => {
    // Speeds up local execution
    if (target === 'local') {
      // navigate back
      await scrollToElementWithTestId('nav-button-back', 'up')
      await tapOnElementWithTestId('nav-button-back', 0)
    }
  })

  it('should support the user journey', async () => {
    // preparation of test
    await navigateToAppById('donations')

    // FIXME currently not working on ios
    if (platform !== 'ios') {
      const listItemsBefore = await assertDisplaysMultipleProjects()

      await assertAllowsPagination(listItemsBefore)
    }

    await assertProjectDetails()

    const resultCountGermany = await assertFilterDonationsByLocation()

    await assertResetDonationsFilterFromList()

    await assertMoreSpecificFilter(resultCountGermany)

    await assertKeepsFilterAfterNavigatingToDetails()

    await assertResetFilterFromModal()
  })
})

const assertResetFilterFromModal = async () => {
  await resetFilterInModal()
  // assert reset
  await waitForElementWithTestId('donations-list-unfiltered')
}

const assertKeepsFilterAfterNavigatingToDetails = async () => {
  await assertProjectDetails()
  // expect filtered list
  await seeTextWithTestId('Hamburg', 'donations-list-search-heading')
}

const assertMoreSpecificFilter = async (resultCountGermany: number) => {
  await filterForLocation('Hamburg')
  // assert and compare results
  await seeTextWithTestId('Hamburg', 'donations-list-search-heading')
  const resultCountHamburg = await extractResultCount('donations-list-search-summary')
  expect(resultCountHamburg).toBeGreaterThan(0)
  expect(resultCountHamburg).toBeLessThan(resultCountGermany)
}

const assertResetDonationsFilterFromList = async () => {
  await tapOnElementWithTestId('donations-list-search-reset')
  expect(await waitForElementWithTestId('donations-list-unfiltered'))
}

const assertFilterDonationsByLocation = async () => {
  await filterForLocation('Germany')
  // count results for comparison
  await seeTextWithTestId('Germany', 'donations-list-search-heading')
  const resultCountGermany = await extractResultCount('donations-list-search-summary')
  expect(resultCountGermany).toBeGreaterThan(0)
  return resultCountGermany
}

const assertProjectDetails = async () => {
  // navigate to details page
  await tapOnElementWithTestId('donations-list-item')
  // assert detail page
  await waitForElementWithTestId('donations-project-detail-heading')
  await waitForElementWithTestId('donations-project-detail-donate-btn')
  await waitForElementWithTestId('donations-project-initiative-btn')
  // navigate back
  await scrollToElementWithTestId('nav-button-back', 'up')
  await tapOnElementWithTestId('nav-button-back')
}

const assertAllowsPagination = async (listItemsBefore: Record<string, unknown>[]) => {
  // load more
  await tapOnElementWithTestId('btn-donation-list-load-more')
  // wait until "load more" button has been replaced by next list item
  await waitForElementWithTestIdToBeNull('btn-donation-list-load-more')
  // expect more elements in viewport than before (as the button has been pushed down)
  const listItemsAfter = await locateMultipleElementsWithTestId('donations-list-item')
  expect(listItemsAfter.length).toBeGreaterThan(listItemsBefore.length)
}

const assertDisplaysMultipleProjects = async () => {
  // scroll to button and count elements in viewport
  await scrollToElementWithTestId('btn-donation-list-load-more', 'down', { maxAttempts: 10 })
  const listItemsBefore = await locateMultipleElementsWithTestId('donations-list-item')
  expect(listItemsBefore.length).toBeGreaterThan(1)
  return listItemsBefore
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
