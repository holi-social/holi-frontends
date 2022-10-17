import { tapOnElementWithTestId, waitForElementWithTestId } from '../helpers/selectors'

describe('@HoliModal', () => {
  it('find selectors', async () => {
    await waitForElementWithTestId('home-feed-insights-heading')

    // open editors modal
    await waitForElementWithTestId('avatar-pile-open-modal-button')
    await tapOnElementWithTestId('avatar-pile-open-modal-button')

    // inspect modal content
    await waitForElementWithTestId('insight-editors')
    await waitForElementWithTestId('insight-editors-heading')

    // close modal
    // TODO: This does not work on android (during testing), we need to use the close button
    // await waitForElementWithTestId('insight-editors-modal-backdrop')
    // await tapOnElementWithTestId('insight-editors-modal-backdrop')

    await waitForElementWithTestId('insight-editors-close-btn')
    await tapOnElementWithTestId('insight-editors-close-btn')

    // modal should be closed again
    await waitForElementWithTestId('home-feed-insights-heading')
  })
})
