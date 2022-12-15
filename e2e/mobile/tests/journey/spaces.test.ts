import { waitForHomeScreen } from '../../helpers/navigation'
import { itif } from '../../helpers/platform'
import {
  locateMultipleElementsWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
} from '../../helpers/selectors'

const navigateToSpaces = async () => {
  await waitForHomeScreen()
  await tapOnElementWithTestId('btn-to-spaces')
  await waitForElementWithTestId('spaces-container')
}

describe('@Spaces', () => {
  beforeEach(async () => {
    await navigateToSpaces()
  })

  afterEach(async () => {
    // Speeds up local execution
    if (target === 'local') {
      await tapOnElementWithTestId('btn-to-home-view', 0)
    }
  })

  it('should display multiple topics with spaces', async () => {
    const topics = await locateMultipleElementsWithTestId('spaces-topic-container')
    expect(topics.length).toBeGreaterThan(1)
    const spaces = await locateMultipleElementsWithTestId('btn-to-space')
    expect(spaces.length).toBeGreaterThan(1)
  })

  it('should go to filtered spaces page and display multiple spaces with that filter', async () => {
    //const topicElement = await waitForElementWithTestId('spaces-topic-title')
    //const topicTitle = await topicElement.getText()

    await tapOnElementWithTestId('spaces-topic-title')

    // check if page title is the same as topic title
    //await waitForElementWithInnerText(topicTitle)
    // instead, get an element, get its text and then compare both texts

    // check if there is at least one space card (button to space)
    await waitForElementWithTestId('btn-to-space')
  })

  // fails on ios: element ("~space-members") still not displayed after 10000ms
  itif(platform !== 'ios')('should display space details', async () => {
    // click first element on page
    await tapOnElementWithTestId('btn-to-space')

    await waitForElementWithTestId('space-details-container')

    await waitForElementWithTestId('space-header')

    await waitForElementWithTestId('space-avatar')

    await waitForElementWithTestId('space-title')

    await waitForElementWithTestId('space-members')

    await waitForElementWithTestId('space-description')

    // Speeds up local execution
    if (target === 'local') {
      // navigate back
      await tapOnElementWithTestId('nav-button-back')
    }
  })
})
