import { target } from '@holi/e2e-mobile/appiumConfig'

import { navigateBackFromAppScreen, navigateToAppById } from '../../helpers/navigation'
import {
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../../helpers/selectors'
import { delay } from '../../helpers/time'

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

    await navigateToDetailview()
    // expect filtered list
    await waitForElementWithTestId('volunteering-list-container')
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

  // open topics dropdown
  await tapOnElementWithTestId('volunteering-filter-category-input')

  // click on first topic in the list
  await tapOnElementWithTestId('volunteering-filter-category-item')

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
  // swipe to the bottom until the load more button is visible
  await scrollToElementWithTestId('btn-volunteering-list-load-more', 'down', { maxAttempts: 20 })
  // load more
  await tapOnElementWithTestId('btn-volunteering-list-load-more')
  // wait a moment
  await delay(1)
  // wait until "load more" button has been replaced by next list item
  await waitForElementWithTestIdToBeNull('btn-volunteering-list-load-more')
}
