import { target } from '../../appiumConfig'
import { navigateBackFromAppScreen, navigateToAppById } from '../../helpers/navigation'
import {
  checkIfElementWithTestIdExists,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../../helpers/selectors'
import { delayMs } from '../../helpers/time'

describe('@Volunteering', () => {
  afterEach(async () => {
    // Speeds up local execution
    if (target === 'local') {
      // navigate back
      await navigateBackFromAppScreen()
    }
  })

  it('should support the user journey', async () => {
    // preparation of test
    await navigateToAppById('volunteering')

    await assertListItemExisting()

    await navigateToDetailview()

    await assertAllowsPagination()

    await assertFilteringWorks()
  })
})

const assertListItemExisting = async () => {
  await waitForElementWithTestId('btn-to-volunteering-engagement')
}

const assertFilteringWorks = async () => {
  // swipe up to make header visible again
  await scrollToElementWithTestId('btn-to-volunteering-filter-modal', 'up', { maxAttempts: 5 })

  // open filter modal
  await tapOnElementWithTestId('btn-to-volunteering-filter-modal')

  // Tap on modal heading to close keyboard
  await tapOnElementWithTestId('volunteering-filter-heading')

  // open topics dropdown
  await tapOnElementWithTestId('volunteering-filter-topics-input')

  // click on first topic in the list
  await tapOnElementWithTestId('volunteering-filter-topics-item')

  // Tap on modal heading to close keyboard & select
  await tapOnElementWithTestId('volunteering-filter-heading')

  // click filter confirmation button
  await tapOnElementWithTestId('volunteering-filter-modal-close-btn')

  // check if the volunteering app home is shown
  await waitForElementWithTestId('volunteering-list-container')
}

const navigateToDetailview = async () => {
  await tapOnElementWithTestId('btn-to-volunteering-engagement')
  await waitForElementWithTestId('volunteering-detailview-container', 40000)

  // go back to items listing
  await scrollToElementWithTestId('nav-button-back', 'up')
  await tapOnElementWithTestId('nav-button-back', 0)
}

const assertAllowsPagination = async () => {
  const list = await waitForElementWithTestId('volunteering-list-unfiltered')
  const { height: heightBefore } = await list.getSize()

  // HOLI-9711: handling both variants
  // Legacy variant
  // swipe to the bottom until the load more button is visible
  await scrollToElementWithTestId('btn-volunteering-list-load-more', 'down', { maxAttempts: 20 })
    // Catch error: Button does not exist for DiscoveryV1 variant
    .catch(() => ({}))

  const useLegacyVariant = await checkIfElementWithTestIdExists('btn-volunteering-list-load-more')

  if (useLegacyVariant) {
    // load more
    await tapOnElementWithTestId('btn-volunteering-list-load-more')
    // wait a moment
    await delayMs(1000)
    // wait until "load more" button has been replaced by next list item
    await waitForElementWithTestIdToBeNull('btn-volunteering-list-load-more')
  } else {
    // Scrolling down should already have triggered pagination-on-scroll and added new elements => List height should have been increased
    const { height: heightAfter } = await list.getSize()
    expect(heightAfter).toBeGreaterThan(heightBefore)
  }
}
