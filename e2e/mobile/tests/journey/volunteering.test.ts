import { scrollDown } from '@holi/e2e-mobile/helpers/gestures'

import { target } from '../../appiumConfig'
import { navigateBackFromAppScreen, navigateToAppById } from '../../helpers/navigation'
import {
  retry,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
} from '../../helpers/selectors'
import { continueAsGuest } from '@holi/e2e-mobile/helpers/auth'

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
    await continueAsGuest()
    await navigateToAppById('volunteering')

    await assertListItemExisting()

    await navigateToDetailview()

    await assertAllowsPagination()

    await assertFilteringWorks()
  })
})

const assertListItemExisting = async () => {
  await waitForElementWithTestId('volunteering-reco-card')
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
  await tapOnElementWithTestId('volunteering-reco-card')
  await waitForElementWithTestId('volunteering-detailview-container', 40000)

  // go back to items listing
  await scrollToElementWithTestId('nav-button-back', 'up')
  await tapOnElementWithTestId('nav-button-back', 0)
}

const assertAllowsPagination = async () => {
  const list = await waitForElementWithTestId('volunteering-list-unfiltered')
  const { height: heightBefore } = await list.getSize()

  // Scroll down to trigger pagination-on-scroll
  for (let i = 0; i < 10; i++) {
    await scrollDown()
  }

  // New elements should have been added to the list, increasing the list height
  await retry(async () => {
    const { height: heightAfter } = await list.getSize()
    expect(heightAfter).toBeGreaterThan(heightBefore)
  })
}
