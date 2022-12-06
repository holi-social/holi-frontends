import { navigateToAppById } from '../../helpers/navigation'
import {
  locateMultipleElementsWithTestId,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../../helpers/selectors'

describe('@GoodNews', () => {
  beforeEach(async () => {
    await navigateToAppById('goodnews')
  })

  afterEach(async () => {
    // Speeds up local execution
    if (target === 'local') {
      // navigate back
      await scrollToElementWithTestId('nav-button-back', 'up')
      await tapOnElementWithTestId('nav-button-back', 0)
    }
  })

  it('should display multiple projects', async () => {
    // listItems only contains elements visible in viewport
    const listItems = await locateMultipleElementsWithTestId('goodnews-list-item')
    expect(listItems.length).toBeGreaterThan(1)
  })

  it('should allow pagination', async () => {
    // scroll to button and count elements in viewport
    await scrollToElementWithTestId('btn-goodnews-list-load-more', 'down', { maxAttempts: 10 })
    const listItemsBefore = await locateMultipleElementsWithTestId('goodnews-list-item')

    // load more
    await tapOnElementWithTestId('btn-goodnews-list-load-more')

    // wait until "load more" button has been replaced by next list item
    await waitForElementWithTestIdToBeNull('btn-goodnews-list-load-more')

    // expect more elements in viewport than before (as the button has been pushed down)
    const listItemsAfter = await locateMultipleElementsWithTestId('goodnews-list-item')
    expect(listItemsAfter.length).toBeGreaterThan(listItemsBefore.length)
  })
})
