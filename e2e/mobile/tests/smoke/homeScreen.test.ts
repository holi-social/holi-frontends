import { navigateBackToHomeScreen } from '../../helpers/navigation'
import { tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

describe('@HomeScreen', () => {
  it('should work', async () => {
    await navigateBackToHomeScreen()
    await waitForElementWithTestId('home-feed-insights-heading')

    // go to insight screen
    await waitForElementWithTestId('feed-insight-image-link')
    await tapOnElementWithTestId('feed-insight-image-link')

    await waitForElementWithTestId('insight-headline')

    // go home
    await navigateBackToHomeScreen()
  })
})
