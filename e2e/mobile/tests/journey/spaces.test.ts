import { waitForHomeScreen } from '../../helpers/navigation'
import {
  locateMultipleElementsWithTestId,
  tapOnElementWithTestId,
  waitForElementWithInnerText,
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
    const topicElement = await waitForElementWithTestId('spaces-topic-title')
    const topicTitle = await topicElement.getText()

    await tapOnElementWithTestId('spaces-topic-title')

    // check if page title is the same as topic title
    await waitForElementWithInnerText(topicTitle)

    // check if there is at least one space card (button to space)
    await waitForElementWithTestId('btn-to-space')
  })

  it('should display space details', async () => {
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
  /* 
  test('should display space collaborators', async ({ page }) => {
    await waitForElementByTestId(page, 'spaces-container')
    await clickElementByTestId(page, 'btn-to-space')
    await waitForElementByTestId(page, 'space-details-container')

    await checkAccessibility(page)

    // check if collaborators are displayed
    await waitForElementByTestId(page, 'space-members')
    await clickElementByTestId(page, 'space-members')
    await waitForElementByTestId(page, 'spaces-collaborators-modal')

    // check if on click the arrow down the modal layer is closed
    await waitForElementByTestId(page, 'nav-button-down')
    await clickElementByTestId(page, 'nav-button-down')
    await waitForElementByTestId(page, 'space-details-container')

    // check if on click the user profile is displayed
    await clickElementByTestId(page, 'space-members')
    await waitForElementByTestId(page, 'spaces-collaborators-item')
    await clickElementByTestId(page, 'spaces-collaborators-item')
    await waitForElementByTestId(page, 'user-profile-full-name')

    const profilePrefix = '/profile/'
    expect(page.url()).toContain(profilePrefix)
  }) */

  it('should display space collaborators', async () => {
    await waitForElementWithTestId('spaces-container')
    await tapOnElementWithTestId('btn-to-space')
    await waitForElementWithTestId('space-details-container')

    // check if collaborators are displayed
    await tapOnElementWithTestId('space-members')
  })
})
