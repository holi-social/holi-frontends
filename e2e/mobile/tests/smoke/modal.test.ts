import { continueAsGuest } from '@holi/e2e-mobile/helpers/auth'
import {
  checkIfElementWithTestIdExists,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
} from '../../helpers/selectors'
import { navigateBackToHomeScreen } from '@holi/e2e-mobile/helpers/navigation'

describe('@HoliModal', () => {
  it('find selectors', async () => {
    await continueAsGuest()

    await waitForElementWithTestId('posts-list-results') // wait that posts are loaded

    const isNewFeed = await checkIfElementWithTestIdExists('feed-posts')

    if (isNewFeed) {
      // New feed: Search for and click first insight
      await scrollToElementWithTestId('insight-card', 'down')

      await tapOnElementWithTestId('insight-card')

      // open editors modal
      await tapOnElementWithTestId('btn-to-insight-curator-modal')
    } else {
      // Legacy feed: scoll to insights section
      await scrollToElementWithTestId('avatar-pile-open-modal-button', 'down')

      // open editors modal
      await tapOnElementWithTestId('avatar-pile-open-modal-button')
    }

    // inspect modal content
    await waitForElementWithTestId('insight-editors-modal-backdrop')
    await waitForElementWithTestId('insight-editors-heading')

    // close modal
    // TODO: This does not work on android (during testing), we need to use the close button
    // await waitForElementWithTestId('insight-editors-modal-backdrop')
    // await tapOnElementWithTestId('insight-editors-modal-backdrop')

    await tapOnElementWithTestId('insight-editors-close-btn')

    if (isNewFeed) {
      // now the editors should be visible again
      await waitForElementWithTestId('btn-to-insight-curator-modal')

      // Navigate back to home screen
      await navigateBackToHomeScreen('nav-button-back')
    } else {
      // now the editors should be visible again
      await waitForElementWithTestId('avatar-pile-open-modal-button')
    }
  })
})
