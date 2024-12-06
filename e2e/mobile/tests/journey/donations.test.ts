import { scrollUp } from '../../helpers/gestures'
import { navigateBackFromAppScreen, navigateToAppById } from '../../helpers/navigation'
import {
  fillFieldByTestId,
  locateMultipleElementsWithTestId,
  pressEnter,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../../helpers/selectors'

describe('@Donations', () => {
  afterEach(async () => {
    // Speeds up local execution
    if (target === 'local') {
      // navigate back
      await navigateBackFromAppScreen()
    }
  })

  // fails on android: The element 'By.xpath: //*[@resource-id='donations-search-modal']' does not exist in DOM anymore
  // fails on ios: Couldn't tap on element with testID: donations-list-item
  it('should support the user journey', async () => {
    // preparation of test
    await navigateToAppById('donations')

    await assertProjectDetails()

    // Filtering is disabled, because we can no longer filter by location on the Betterplace API.
    // https://holi.atlassian.net/browse/HOLI-9717
    // Can be re-enabled when we use the donations from our own DB. Please remember to also re-enable the e2e test web and mobile!
    // await assertFilterDonationsByLocation()

    // await assertKeepsFilterAfterNavigatingToDetails()

    // await assertResetDonationsFilterFromList()

    await assertAllowsPagination()
  })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const assertKeepsFilterAfterNavigatingToDetails = async () => {
  await assertProjectDetails()
  // expect filtered list
  await waitForElementWithTestId('donations-list-search-reset')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const assertResetDonationsFilterFromList = async () => {
  await tapOnElementWithTestId('donations-list-search-reset')
  expect(await waitForElementWithTestId('donations-list-unfiltered'))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const assertFilterDonationsByLocation = async () => {
  await filterForLocation('Germany')
  await scrollToElementWithTestId('donations-list-search-reset', 'up')
}

const assertProjectDetails = async () => {
  // navigate to details page
  await tapOnElementWithTestId('donations-list-item')
  // assert detail page
  await waitForElementWithTestId('donations-detailview-container')
  await waitForElementWithTestId('donations-project-detail-donate-btn')
  await waitForElementWithTestId('donations-project-initiative-btn')
  // navigate back
  await scrollToElementWithTestId('nav-button-back', 'up')
  await tapOnElementWithTestId('nav-button-back')
}

const assertAllowsPagination = async () => {
  // scroll to button and count elements in viewport
  await scrollToElementWithTestId('btn-donation-list-load-more', 'down', { maxAttempts: 20 })
  // get current number of visible items
  const listItemsBefore = await assertDisplaysMultipleProjects()
  // load more
  await tapOnElementWithTestId('btn-donation-list-load-more')
  // wait until "load more" button has been replaced by next list item
  await waitForElementWithTestIdToBeNull('btn-donation-list-load-more-processing', 20000)
  // expect more elements in viewport than before (as the button has been pushed down)
  const listItemsAfter = await locateMultipleElementsWithTestId('donations-list-item')
  expect(listItemsAfter.length).toBeGreaterThan(await listItemsBefore.length)
}

const assertDisplaysMultipleProjects = async () => {
  const listItemsBefore = await locateMultipleElementsWithTestId('donations-list-item')
  expect(listItemsBefore.length).toBeGreaterThan(1)
  return listItemsBefore
}

const filterForLocation = async (location: string) => {
  // scroll up to make sure top menu shows up
  await scrollUp()

  // open search modal
  await tapOnElementWithTestId('donations-search-button')

  // enter location
  await fillFieldByTestId('donations-search-location-input', location)

  // submit form
  // Not using suggestions here, as they can not be easily identified and selected
  await pressEnter('donations-search-location-input')
  await tapOnElementWithTestId('donations-search-modal-content-close-btn')

  // wait for results
  await waitForElementWithTestId('donations-list-container')
}
