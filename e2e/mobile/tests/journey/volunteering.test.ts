import { navigateToAppById } from '../../helpers/navigation'
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
      await scrollToElementWithTestId('nav-button-back', 'up')
      await tapOnElementWithTestId('nav-button-back', 0)
    }
  })

  it('should support the user journey', async () => {
    // preparation of test
    await navigateToAppById('volunteering')

    await assertListItemExisting()

    await navigateToDetailview()

    await assertAllowsPagination()
  })
})

const assertListItemExisting = async () => {
  // await waitForElementWithTestId('volunteering-list-item')
  await waitForElementWithTestId('btn-to-volunteering-engagement')
}

const navigateToDetailview = async () => {
  await tapOnElementWithTestId('btn-to-volunteering-engagement')
  await waitForElementWithTestId('volunteering-engagement-detail-container')

  // go back to items listing
  await scrollToElementWithTestId('nav-button-back', 'up')
  await tapOnElementWithTestId('nav-button-back', 0)
}

const assertAllowsPagination = async () => {
  // swipe to the bottom until the load more button is visible
  await scrollToElementWithTestId('btn-volunteering-list-load-more', 'down', { maxAttempts: 5 })
  // load more
  await tapOnElementWithTestId('btn-volunteering-list-load-more')
  // wait a moment
  await delay(1)
  // wait until "load more" button has been replaced by next list item
  await waitForElementWithTestIdToBeNull('btn-volunteering-list-load-more')
}
