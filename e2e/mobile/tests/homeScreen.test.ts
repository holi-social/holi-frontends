import { seeElementWithTestId, seeTextWithTestId, tapOnElementWithTestId } from '../helpers/selectors'

describe('@HomeScreen', () => {
  it('should work', async () => {
    await seeElementWithTestId('home-feed-topics-heading')

    await tapOnElementWithTestId('app-tile-volunteering')
    await seeTextWithTestId('Volunteering', 'apps-volunteering-heading')

    await tapOnElementWithTestId('nav-button-home')
    await seeElementWithTestId('home-feed-topics-heading')
  })
})
