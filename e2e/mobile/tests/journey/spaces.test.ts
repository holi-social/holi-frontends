import { defaultAuthSteps, logout } from '../../helpers/auth'
import { waitForHomeScreen } from '../../helpers/navigation'
import {
  fillFieldByTestId,
  locateMultipleElementsWithTestId,
  scrollToElementWithTestId,
  seeTextWithTestId,
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
  const initialName = 'e2e space name'
  const initialGoal = 'e2e space goal'
  const numberOfInitialTerms = 3
  const numberOfEditedTerms = 2

  afterEach(async () => {
    // Speeds up local execution
    if (target === 'local') {
      await tapOnElementWithTestId('btn-to-home-view', 0)
      await logout()
    }
  })

  it('should support the user journey', async () => {
    // preparation of test
    await navigateToSpaces()

    await assertMultipleGroupsDisplayed()
    await assertFilteringWorks()
    await assertSpaceDetailsDisplayed()
    await assertSharingSpaceWorks()
    await assertCreatingSpace()
    await assertEditingSpace()
    await assertDeletingSpace()
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

    // make sure dropdown is closed by tapping the heading
    await tapOnElementWithTestId('spaces-filter-modal-heading')

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

    // reset the filter and wait for unfiltered results
    await tapOnElementWithTestId('spaces-filter-reset')
    await waitForElementWithTestId('spaces-container')
  }

  const assertSpaceDetailsDisplayed = async () => {
    // click first element on page
    await tapOnElementWithTestId('space-link')

    await waitForElementWithTestId('space-details-container')

    await waitForElementWithTestId('space-header')

    await waitForElementWithTestId('space-avatar')

    await waitForElementWithTestId('space-title')

    // FIXME: not working anymore:
    // element ("//*[@resource-id='space-details-container']") still not displayed after 10000ms
    // await tapOnElementWithTestId('btn-to-open-space-collaborators-modal')
    // Only check if button to open modal is displayed
    await waitForElementWithTestId('btn-to-open-space-collaborators-modal')

    // // check if space collaborators are displayed
    // await waitForElementWithTestId('spaces-collaborators-item')

    // // close space collaborators modal
    // await tapOnElementWithTestId('btn-to-close-space-collaborators-modal')

    // wait until space details are displayed again
    await waitForElementWithTestId('space-details-container')

    await scrollToElementWithTestId('space-description', 'down', { maxAttempts: 2 })
  }

  const assertSharingSpaceWorks = async () => {
    // open options menu
    await tapOnElementWithTestId('space-options-btn')

    // check if share button is displayed
    await waitForElementWithTestId('space-share-btn')

    // close options menu
    await tapOnElementWithTestId('btn-to-close-more-options-modal')

    // close space details page
    await tapOnElementWithTestId('nav-button-back')
  }

  const assertCreatingSpace = async () => {
    // login
    await defaultAuthSteps()
    await tapOnElementWithTestId('btn-to-spaces')
    await tapOnElementWithTestId('btn-create-space')

    // create space - name and goal
    await checkConfirmButtonIsDisabled()
    await inputSpaceNameAndGoal(initialName, initialGoal)
    await tapOnElementWithTestId('holi-wizard-next-btn')

    // create space - topics
    await checkConfirmButtonIsDisabled()
    await selectSomeTerms(numberOfInitialTerms)
    await tapOnElementWithTestId('holi-wizard-next-btn')

    // create space - cover image
    // FIXME: currently we mock the image upload for this test to circumvent using the native file picker, so there already is an image preselected and we can directly continue
    await waitForElementWithTestId('create-space-remove-image-btn')
    await tapOnElementWithTestId('holi-wizard-next-btn')
  }

  const assertEditingSpace = async () => {
    // check if edit space page has correct information
    await seeTextWithTestId(initialName, 'space-edit-title')
    await seeTextWithTestId(initialGoal, 'space-edit-goal')

    // edit space name and goal
    const editedName = 'e2e edited space name HELLO THERE'
    const editedGoal = 'e2e edited space goal'
    await tapOnElementWithTestId('btn-space-edit-name')
    await inputSpaceNameAndGoal(editedName, editedGoal)
    await tapOnElementWithTestId('space-edit-modal-save-btn')

    // check if space name and goal were updated
    await seeTextWithTestId(editedName, 'space-edit-title')
    await seeTextWithTestId(editedGoal, 'space-edit-goal')

    // TODO: test editing images
    // // edit space avatar
    // await tapOnElementWithTestId('btn-space-edit-avatar')
    // // await page.setInputFiles('input[type="file"]', 'upload/avatar.png')
    // await tapOnElementWithTestId('space-edit-modal-save-btn')

    // // edit space cover image
    // await tapOnElementWithTestId('btn-space-edit-cover')
    // // await page.setInputFiles('input[type="file"]', 'upload/cover_2.png')
    // await tapOnElementWithTestId('space-edit-modal-save-btn')

    // edit space topics
    await tapOnElementWithTestId('btn-space-edit-topics')
    await selectSomeTerms(numberOfEditedTerms)
    await tapOnElementWithTestId('space-edit-modal-save-btn')

    // check if the correct number of topics have been selected
    await delay(1)
    const numberOfEditedTopics = (await locateMultipleElementsWithTestId('space-edit-topics-chip')).length
    expect(numberOfEditedTopics).toBe(numberOfEditedTerms)

    // edit space sdgs
    await scrollToElementWithTestId('btn-space-edit-sdgs', 'down', { maxAttempts: 2 })
    await tapOnElementWithTestId('btn-space-edit-sdgs')
    await selectSomeTerms(numberOfEditedTerms)
    await tapOnElementWithTestId('space-edit-modal-save-btn')

    // check if the correct number of sdgs have been selected
    await delay(1)
    const numberOfEditedSdgs = (await locateMultipleElementsWithTestId('space-edit-sdgs-chip')).length
    expect(numberOfEditedSdgs).toBe(numberOfEditedTerms)
  }

  const assertDeletingSpace = async () => {
    // delete space
    await tapOnElementWithTestId('space-edit-close')
    await tapOnElementWithTestId('space-options-btn')
    await tapOnElementWithTestId('space-delete-btn')
    await tapOnElementWithTestId('space-delete-confirmation-confirm')

    // check if after deletion we are at the spaces dashboard (mine/discover)
    await waitForElementWithTestId('btn-create-space')
  }

  const checkConfirmButtonIsDisabled = async () => {
    const nextButton = await waitForElementWithTestId('holi-wizard-next-btn')
    await nextButton.waitForEnabled({ reverse: true })
  }

  const inputSpaceNameAndGoal = async (name: string, goal: string) => {
    await waitForElementWithTestId('space-name-input')
    await waitForElementWithTestId('space-goal-input')
    await fillFieldByTestId('space-name-input', name)
    await fillFieldByTestId('space-goal-input', goal)
    // Click on the title (or anywhere outside the keyboard) to close the keyboard
    // There is no safe way to close the keyboard on iOS, so it's recommended to do it ourselves
    // https://github.com/appium/appium/issues/15073
    await tapOnElementWithTestId('space-name-and-goal-title')
  }

  const selectSomeTerms = async (numberOfTermsToSelect = 3) => {
    const unselectedTerms = await locateMultipleElementsWithTestId('space-terms-list-item')
    const selectedTerms = await locateMultipleElementsWithTestId('space-terms-list-item-checked')

    // unselect previous terms
    for (let i = 0; i < selectedTerms.length; i++) {
      await Appium.touchAction({ element: selectedTerms[i], action: 'tap' })
    }

    // select new terms
    for (let i = 0; i < numberOfTermsToSelect; i++) {
      await Appium.touchAction({ element: unselectedTerms[unselectedTerms.length - i - 1], action: 'tap' })
    }
  }
})
