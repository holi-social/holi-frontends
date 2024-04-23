// eslint-disable-next-line prettier/prettier
import { navigateBackFromAppScreen, navigateToAppById } from '../../helpers/navigation'
import {
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../../helpers/selectors'

describe('@GoodNews', () => {
  afterEach(async () => {
    // Speeds up local execution
    if (target === 'local') {
      // navigate back
      await navigateBackFromAppScreen()
    }
  })

  it('should support the user journey', async () => {
    // preparation of test
    await navigateToAppById('goodnews', 'goodnews-detailview-container')

    await assertAllowsPagination()
  })
})

const assertAllowsPagination = async () => {
  // swipe to the right until the teaser component is visible
  await scrollToElementWithTestId('btn-goodnews-list-load-more', 'right', { maxAttempts: 20 })
  // load more
  await tapOnElementWithTestId('btn-goodnews-list-load-more')
  // wait a moment
  await tapOnElementWithTestId('goodnews-detailview-container')
  // wait until "load more" button has been replaced by next list item
  await waitForElementWithTestIdToBeNull('btn-goodnews-list-load-more')
}
