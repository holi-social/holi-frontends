import { navigateBackToHomeScreen } from '../helpers/navigation'
import { tapOnElementWithTestId, waitForElementWithTestId } from '../helpers/selectors'

describe('@HomeScreen', () => {
  it('should work', async () => {
    await waitForElementWithTestId('home-feed-topics-heading')

    // go to topic screen
    await waitForElementWithTestId('feed-topic-image-link')
    await tapOnElementWithTestId('feed-topic-image-link')

    await waitForElementWithTestId('topic-headline')

    // go home
    await navigateBackToHomeScreen()

    // open volunteering app
    await waitForElementWithTestId('app-tile-volunteering')
    await tapOnElementWithTestId('app-tile-volunteering')
    await waitForElementWithTestId('apps-volunteering-heading')

    // go home
    await navigateBackToHomeScreen()
  })
})
