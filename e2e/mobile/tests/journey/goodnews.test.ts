// eslint-disable-next-line prettier/prettier
import { target } from '../../global'
import { navigateBackFromAppScreen, navigateToAppById } from '../../helpers/navigation'
import {
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../../helpers/selectors'
import { delay } from '../../helpers/time'

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
    await navigateToAppById('goodnews')

    await assertListItemExisting()

    await assertAllowsPagination()
  })
})

const assertListItemExisting = async () => {
  await waitForElementWithTestId('goodnews-detailview-container')
}

const assertAllowsPagination = async () => {
  // swipe to the right until the teaser component is visible
  await scrollToElementWithTestId('btn-goodnews-list-load-more', 'right', { maxAttempts: 20 })
  // load more
  await tapOnElementWithTestId('btn-goodnews-list-load-more')
  // wait a moment
  await delay(1)
  // wait until "load more" button has been replaced by next list item
  await waitForElementWithTestIdToBeNull('btn-goodnews-list-load-more')
}
