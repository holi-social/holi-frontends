import { defaultAuthSteps } from '../../helpers/auth'
import { waitForHomeScreen } from '../../helpers/navigation'
import {
  fillFieldByTestId,
  locateMultipleElementsWithTestId,
  scrollToElementWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
} from '../../helpers/selectors'
import { delay } from '../../helpers/time'

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

    await assertCreateSpace()
  })

  const assertMultipleGroupsDisplayed = async () => {
    const groups = await locateMultipleElementsWithTestId('spaces-group-slider')
    expect(groups.length).toBeGreaterThan(0)
    const spaces = await locateMultipleElementsWithTestId('space-link')
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
    await tapOnElementWithTestId('space-link')

    await waitForElementWithTestId('space-details-container')

    await waitForElementWithTestId('space-header')

    await waitForElementWithTestId('space-avatar')

    await waitForElementWithTestId('space-title')

    await waitForElementWithTestId('btn-to-open-space-collaborators-modal')

    await scrollToElementWithTestId('space-description', 'down', { maxAttempts: 2 })

    // FIXME: not working anymore:
    // element ("//*[@resource-id='space-details-container']") still not displayed after 10000ms
    // await tapOnElementWithTestId('btn-to-open-space-collaborators-modal')

    // // check if space collaborators are displayed
    // await waitForElementWithTestId('spaces-collaborators-item')

    // // close space collaborators modal
    // await tapOnElementWithTestId('btn-to-close-space-collaborators-modal')

    // // wait until space details are displayed again
    // await waitForElementWithTestId('space-details-container')

    // close space details page
    await tapOnElementWithTestId('nav-button-back')
  }

  const assertCreateSpace = async () => {
    const numberOfInitialTerms = 3
    const numberOfEditedTerms = 2

    // login
    await defaultAuthSteps()
    await tapOnElementWithTestId('btn-to-spaces')
    await tapOnElementWithTestId('btn-create-space')

    // create space - name and goal
    const initialName = 'e2e space name'
    const initialGoal = 'e2e space goal'
    // await checkConfirmButtonIsDisabled()
    await inputSpaceNameAndGoal(initialName, initialGoal)
    await tapOnElementWithTestId('holi-wizard-next-btn')

    // create space - topics
    // await checkConfirmButtonIsDisabled()
    await selectSomeTerms(numberOfInitialTerms)
    await tapOnElementWithTestId('holi-wizard-next-btn')

    // create space - cover image
    await checkConfirmButtonIsDisabled()
    // await page.setInputFiles('input[type="file"]', 'upload/cover_1.png')
    await tapOnElementWithTestId('holi-wizard-next-btn')

    // check if edit space page has correct information
    let editSpaceTitle = await waitForElementWithTestId('space-edit-title')
    let editSpaceGoal = await waitForElementWithTestId('space-edit-goal')
    expect(editSpaceTitle).toContainText(initialName)
    expect(editSpaceGoal).toContainText(initialGoal)

    // // edit space name and goal
    const editedName = 'e2e edited space name HELLO THERE'
    const editedGoal = 'e2e edited space goal'
    await tapOnElementWithTestId('btn-space-edit-name')
    await inputSpaceNameAndGoal(editedName, editedGoal)
    await tapOnElementWithTestId('space-edit-modal-save-btn')

    // check if space name and goal were updated
    editSpaceTitle = await waitForElementWithTestId('space-edit-title')
    editSpaceGoal = await waitForElementWithTestId('space-edit-goal')
    expect(editSpaceTitle).toContainText(editedName)
    expect(editSpaceGoal).toContainText(editedGoal)

    // edit space avatar
    await tapOnElementWithTestId('btn-space-edit-avatar')
    // await page.setInputFiles('input[type="file"]', 'upload/avatar.png')
    await tapOnElementWithTestId('space-edit-modal-save-btn')

    // edit space cover image
    await tapOnElementWithTestId('btn-space-edit-cover')
    // await page.setInputFiles('input[type="file"]', 'upload/cover_2.png')
    await tapOnElementWithTestId('space-edit-modal-save-btn')

    // edit space topics
    await tapOnElementWithTestId('btn-space-edit-topics')
    await selectSomeTerms(numberOfEditedTerms)
    await tapOnElementWithTestId('space-edit-modal-save-btn')

    // check if the correct number of topics have been selected
    await delay(1)
    const numberOfEditedTopics = await page.locator(byTestId('space-edit-topics-chip')).count()
    expect(numberOfEditedTopics).toBe(numberOfEditedTerms)

    // edit space sdgs
    await tapOnElementWithTestId('btn-space-edit-sdgs')
    await selectSomeTerms(numberOfEditedTerms)
    await tapOnElementWithTestId('space-edit-modal-save-btn')

    // check if the correct number of sdgs have been selected
    await delay(1)
    const numberOfEditedSdgs = await page.locator(byTestId('space-edit-sdgs-chip')).count()
    expect(numberOfEditedSdgs).toBe(numberOfEditedTerms)

    // delete space
    await tapOnElementWithTestId('space-edit-close')
    await tapOnElementWithTestId('space-options-btn')
    await tapOnElementWithTestId('space-delete-btn')
    await tapOnElementWithTestId('space-delete-confirmation-confirm')

    // check if after deletion we are at the spaces dashboard (mine/discover)
    await waitForElementWithTestId('spaces-tab-navigation')
  }

  const checkConfirmButtonIsDisabled = async () => {
    const nextButton = await waitForElementWithTestId('holi-wizard-next-btn')
    await nextButton.isDisabled()
  }

  const inputSpaceNameAndGoal = async (name: string, goal: string) => {
    await waitForElementWithTestId('space-name-input')
    await waitForElementWithTestId('space-goal-input')
    await fillFieldByTestId('space-name-input', name)
    await fillFieldByTestId('space-goal-input', goal)
  }

  const selectSomeTerms = async (numberOfTermsToSelect = 3) => {
    const locator = await waitForElementWithTestId('space-terms-list-item')
    // const numberOfTotalTerms = await locator.count()
    const numberOfSelectedTerms = (await waitForElementWithTestId('space-terms-list-item-checked')).count()

    // unselect all
    for (let i = 0; i < numberOfSelectedTerms; i++) {
      // the selected terms are always sorted as first, thus nth(0)
      await locator.nth(0).tap()
    }

    // select new terms
    for (let i = 0; i < numberOfTermsToSelect; i++) {
      // the selected terms are always sorted as first, so we select the last ones to avoid unselection
      // await locator.nth(numberOfTotalTerms - 1).tap()
    }
  }
})
