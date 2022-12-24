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
  afterEach(async () => {
    // Speeds up local execution
    if (target === 'local') {
      await tapOnElementWithTestId('btn-to-home-view', 0)
    }
  })

  it('should support the user journey', async () => {
    // preparation of test
    await navigateToSpaces()

    await assertMultipleGroupsDisplayed()

    await assertSpaceDetails()

    await assertFilteringWorks()
  })

  const assertMultipleGroupsDisplayed = async () => {
    const groups = await locateMultipleElementsWithTestId('spaces-group-slider')
    expect(groups.length).toBeGreaterThan(0)
    const spaces = await locateMultipleElementsWithTestId('btn-to-space')
    expect(spaces.length).toBeGreaterThan(0)
  }

  const assertFilteringWorks = async () => {
    await tapOnElementWithTestId('btn-filter-spaces')

    const locationFilterValue = 'Berlin'
    await fillFieldByTestId('spaces-filter-location-input', locationFilterValue)

    // open topics dropdown
    await tapOnElementWithTestId('spaces-filter-interests-input')

    // click on first topic in the list
    await tapOnElementWithTestId('spaces-filter-interests-item')

    // open skills dropdown
    await tapOnElementWithTestId('spaces-filter-skills-input')

    // click on first skill in the list
    await tapOnElementWithTestId('spaces-filter-skills-item')

    // close skills dropdown
    await tapOnElementWithTestId('spaces-filter-skills-toggle-menu')

    // click filter confirmation button
    await tapOnElementWithTestId('holi-modal-content-close-btn')

    // check if the filtered spaces container is shown
    await waitForElementWithTestId('filtered-spaces-container')
  }

  const assertSpaceDetails = async () => {
    // click first element on page
    await tapOnElementWithTestId('btn-to-space')

    await waitForElementWithTestId('space-details-container')

    await waitForElementWithTestId('space-header')

    await waitForElementWithTestId('space-avatar')

    await waitForElementWithTestId('space-title')

    await waitForElementWithTestId('btn-to-open-space-collaborators-modal')

    await waitForElementWithTestId('space-description')

    await tapOnElementWithTestId('btn-to-open-space-collaborators-modal')

    // check if space collaborators are displayed
    await waitForElementWithTestId('spaces-collaborators-item')

    // close space collaborators modal
    await tapOnElementWithTestId('nav-button-back')

    // wait until space details are displayed again
    await waitForElementWithTestId('space-details-container')

    // close space details page
    await tapOnElementWithTestId('nav-button-back')
  }
})
