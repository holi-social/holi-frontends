import { tapOnElementWithTestId, waitForElementWithTestId } from '../helpers/selectors'

describe('@HoliModal', () => {
  it('find selectors', async () => {
    await waitForElementWithTestId('home-feed-topics-heading')

    // open editors modal
    await waitForElementWithTestId('avatar-pile-open-modal-button')
    await tapOnElementWithTestId('avatar-pile-open-modal-button')

    // inspect modal content
    await waitForElementWithTestId('topic-editors')
    await waitForElementWithTestId('topic-editors-heading')

    // close modal
    await waitForElementWithTestId('topic-editors-modal-backdrop')
    await tapOnElementWithTestId('topic-editors-modal-backdrop')
    // or
    // await waitForElementWithTestId('topic-editors-close-btn')
    // await tapOnElementWithTestId('topic-editors-close-btn')
  })
})
