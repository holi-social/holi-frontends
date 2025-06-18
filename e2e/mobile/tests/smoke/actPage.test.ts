import { scrollToElementWithTestId, tapOnElementWithTestId } from '../../helpers/selectors'
import { continueAsGuest } from '@holi/e2e-mobile/helpers/auth'

describe('@ActPage', () => {
  afterEach(async () => {
    // Speeds up local execution
    if (target === 'local') {
      // navigate back to home screen
      await tapOnElementWithTestId('btn-to-home-view')
    }
  })

  it('should be visible and show apps', async () => {
    await continueAsGuest()

    await tapOnElementWithTestId('btn-to-act')

    await scrollToElementWithTestId('volunteering-reco-slider-heading-button', 'down')
    await scrollToElementWithTestId('challenges-reco-slider-heading-button', 'down')
    await scrollToElementWithTestId('donations-reco-slider-heading-button', 'down')
  })
})
