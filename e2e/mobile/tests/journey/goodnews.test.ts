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

    const listItemsBefore = await assertListItems()

    await assertAllowsPagination(listItemsBefore)
  })
})

const assertListItems = async () => {
  const listItemsBefore = await locateMultipleElementsWithTestId('goodnews-list-item')
  expect(listItemsBefore.length).toBeGreaterThan(1)

  return listItemsBefore
}

const assertAllowsPagination = async (listItemsBefore: Record<string, unknown>[]) => {
  await scrollToElementWithTestId('btn-goodnews-list-load-more', 'down', { maxAttempts: 10 })
  // load more
  await tapOnElementWithTestId('btn-goodnews-list-load-more')
  // wait until "load more" button has been replaced by next list item
  await waitForElementWithTestIdToBeNull('btn-goodnews-list-load-more')
  // expect more elements in viewport than before (as the button has been pushed down)
  const listItemsAfter = await locateMultipleElementsWithTestId('goodnews-list-item')
  expect(listItemsAfter.length).toBeGreaterThan(listItemsBefore.length)
}
