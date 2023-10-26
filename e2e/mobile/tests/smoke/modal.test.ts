import { waitForHomeScreen } from '../../helpers/navigation'
import { scrollToElementWithTestId, tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

describe('@HoliModal', () => {
  it('find selectors', async () => {
    await waitForHomeScreen()

    // open editors modal
    await scrollToElementWithTestId('avatar-pile-open-modal-button', 'down')
    await tapOnElementWithTestId('avatar-pile-open-modal-button')

    // inspect modal content
    await waitForElementWithTestId('insight-editors')
    await waitForElementWithTestId('insight-editors-heading')

    // close modal
    // TODO: This does not work on android (during testing), we need to use the close button
    // await waitForElementWithTestId('insight-editors-modal-backdrop')
    // await tapOnElementWithTestId('insight-editors-modal-backdrop')

    await tapOnElementWithTestId('insight-editors-close-btn')

    // now the editors should be visible again
    await waitForElementWithTestId('avatar-pile-open-modal-button')
  })
})
