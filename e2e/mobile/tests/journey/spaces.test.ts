import { waitForHomeScreen } from '../../helpers/navigation'
import {
  fillFieldByTestId,
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

  test('should open the spaces filter menu and filter spaces with multiple filters', async () => {
    await waitForElementWithTestId('btn-filter-spaces')

    await tapOnElementWithTestId('btn-filter-spaces')

    const locationFilterValue = 'Berlin'
    await fillFieldByTestId('spaces-filter-location-input', locationFilterValue)

    // open topics dropdown
    await tapOnElementWithTestId('spaces-filter-interests-input')

    // click on first topic in the list
    await tapOnElementWithTestId('spaces-filter-interests-item')

    // click filter confirmation button
    await tapOnElementWithTestId('holi-modal-content-close-btn')

    // check if there is at least one space card (button to space)
    await waitForElementWithTestId('btn-to-space')

    // Speeds up local execution
    if (target === 'local') {
      // navigate back
      await tapOnElementWithTestId('nav-button-back')
    }
  })

  // fails on ios: element ("~space-members") still not displayed after 10000ms
  it('should display space details', async () => {
    // click first element on page
    await tapOnElementWithTestId('btn-to-space')

    await waitForElementWithTestId('space-details-container')

    await waitForElementWithTestId('space-header')

    await waitForElementWithTestId('space-avatar')

    await waitForElementWithTestId('space-title')

    await waitForElementWithTestId('btn-to-open-space-collaborators-modal')

    await waitForElementWithTestId('space-description')

    // Speeds up local execution
    if (target === 'local') {
      // navigate back
      await tapOnElementWithTestId('nav-button-back')
    }
  })

  it('should display space collaborators', async () => {
    // click first element on page
    await tapOnElementWithTestId('btn-to-space')
    await waitForElementWithTestId('space-details-container')

    // open modal
    await waitForElementWithTestId('space-header')
    await tapOnElementWithTestId('btn-to-open-space-collaborators-modal', 1000)

    // check if collaborators are displayed
    await waitForElementWithTestId('spaces-collaborators-item')

    // check if on click the user profile is displayed
    await tapOnElementWithTestId('spaces-collaborators-item', 1000)
    await waitForElementWithTestId('user-profile-full-name')
  })
})
