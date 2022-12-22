import { navigateToAppById } from '../../helpers/navigation'
import {
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
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

    await assertListItemExisting()

    await assertAllowsPagination()
  })
})

const assertListItemExisting = async () => {
  await waitForElementWithTestId('goodnews-article-component')
}

const assertAllowsPagination = async () => {
  // swipe to the right until the teaser component is visible
  await scrollToElementWithTestId('btn-goodnews-list-load-more', 'right', { repetitions: 12 })
  // load more
  await tapOnElementWithTestId('btn-goodnews-list-load-more')
  // wait a moment
  await new Promise((resolve) => setTimeout(resolve, 500))
  // wait until "load more" button has been replaced by next list item
  await waitForElementWithTestIdToBeNull('btn-goodnews-list-load-more')
}
