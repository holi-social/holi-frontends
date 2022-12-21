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

    /* TODO HOLI-2806 fix test
    await assertAllowsPagination()
     */
  })
})

const assertListItemExisting = async () => {
  await waitForElementWithTestId('goodnews-article-component')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const assertAllowsPagination = async () => {
  await scrollToElementWithTestId('btn-goodnews-list-load-more', 'down', { maxAttempts: 10 })
  // load more
  await tapOnElementWithTestId('btn-goodnews-list-load-more')
  // wait until "load more" button has been replaced by next list item
  await waitForElementWithTestIdToBeNull('btn-goodnews-list-load-more')
}
