import { navigateToAppById } from '../../helpers/navigation'
import {
  locateMultipleElementsWithTestId,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../../helpers/selectors'

describe('@GoodNews', () => {
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
    await navigateToAppById('goodnews')

    await assertListItemsExisting()

    await assertAllowsPagination()
  })
})

const assertListItemsExisting = async () => {
  const listItemsBefore = await locateMultipleElementsWithTestId('goodnews-list-item')
  expect(listItemsBefore.length).toBeGreaterThan(1)
}

const assertAllowsPagination = async () => {
  await scrollToElementWithTestId('btn-goodnews-list-load-more', 'down', { maxAttempts: 10 })
  // load more
  await tapOnElementWithTestId('btn-goodnews-list-load-more')
  // wait until "load more" button has been replaced by next list item
  await waitForElementWithTestIdToBeNull('btn-goodnews-list-load-more')
}
