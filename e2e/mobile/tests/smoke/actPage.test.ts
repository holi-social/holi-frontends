import { waitForHomeScreen } from '@holi/e2e-mobile/helpers/navigation'

import { scrollToElementWithTestId, tapOnElementWithTestId } from '../../helpers/selectors'

describe('@ActPage', () => {
  it('should be visible and show apps', async () => {
    await waitForHomeScreen()
    await tapOnElementWithTestId('btn-to-act')

    await scrollToElementWithTestId('challenges-updates-heading-button', 'down')

    await scrollToElementWithTestId('volunteering-updates-heading-button', 'down')
    await scrollToElementWithTestId('donations-updates-heading-button', 'down')
  })
})
