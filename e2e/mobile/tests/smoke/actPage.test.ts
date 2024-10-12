import { waitForHomeScreen } from '@holi/e2e-mobile/helpers/navigation'

import { scrollToElementWithTestId, tapOnElementWithTestId } from '../../helpers/selectors'

describe('@ActPage', () => {
  it('should be visible and show apps', async () => {
    await waitForHomeScreen()
    await tapOnElementWithTestId('btn-to-act')

    await scrollToElementWithTestId('challenges-reco-slider-heading-button', 'down')

    await scrollToElementWithTestId('volunteering-reco-slider-heading-button', 'down')
    await scrollToElementWithTestId('donations-reco-slider-heading-button', 'down')
  })
})
