import { continueAsGuest } from '@holi/e2e-mobile/helpers/auth'
import { navigateBackToHomeScreen } from '../../helpers/navigation'
import { scrollToElementWithTestId, tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

describe('@HomeScreen', () => {
  it('should work', async () => {
    await continueAsGuest()

    // go to insight screen
    await scrollToElementWithTestId('feed-insight-image-link', 'down')
    await tapOnElementWithTestId('feed-insight-image-link')

    await waitForElementWithTestId('insight-headline')

    // go home
    await navigateBackToHomeScreen('nav-button-back')
  })
})
