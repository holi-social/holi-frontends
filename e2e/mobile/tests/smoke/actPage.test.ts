import { scrollToElementWithTestId, tapOnElementWithTestId } from '../../helpers/selectors'
import { continueAsGuest } from '@holi/e2e-mobile/helpers/auth'

describe('@ActPage', () => {
  it('should be visible and show apps', async () => {
    await continueAsGuest()

    await tapOnElementWithTestId('btn-to-act')

    await scrollToElementWithTestId('challenges-reco-slider-heading-button', 'down')

    await scrollToElementWithTestId('volunteering-reco-slider-heading-button', 'down')
    await scrollToElementWithTestId('donations-reco-slider-heading-button', 'down')
  })
})
