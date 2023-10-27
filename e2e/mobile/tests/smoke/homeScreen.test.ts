import { navigateBackToHomeScreen } from '../../helpers/navigation'
import { scrollToElementWithTestId, tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

describe('@HomeScreen', () => {
  it('should work', async () => {
    await navigateBackToHomeScreen()

    // go to insight screen
    await scrollToElementWithTestId('feed-insight-image-link', 'down')
    await tapOnElementWithTestId('feed-insight-image-link')

    await waitForElementWithTestId('insight-headline')

    // go home
    await navigateBackToHomeScreen('nav-button-back')
  })
})
