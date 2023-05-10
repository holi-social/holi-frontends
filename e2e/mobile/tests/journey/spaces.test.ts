import { defaultAuthSteps, logout } from '../../helpers/auth'
import { scrollDown } from '../../helpers/gestures'
import { waitForHomeScreen } from '../../helpers/navigation'
import {
  fillFieldByTestId,
  locateMultipleElementsWithTestId,
  scrollToElementWithTestId,
  seeTextWithTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
} from '../../helpers/selectors'

const navigateToSpaces = async () => {
  await waitForHomeScreen()
  await tapOnElementWithTestId('btn-to-spaces')
  await waitForElementWithTestId('spaces-container')
}

describe('@Spaces', () => {
  const initialName = 'e2e space name'
  const initialGoal = 'e2e space goal'
  const numberOfInitialTerms = 3

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
    await assertAddEditDeleteTask()
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

    // Force no results screen to be able to reset filter later
    const locationFilterValue = 'nwqekjnk23jn4k23'
    await fillFieldByTestId('spaces-filter-location-input', locationFilterValue)

    // open topics dropdown
    await tapOnElementWithTestId('spaces-filter-interests-input')

    // click on first topic in the list
    await tapOnElementWithTestId('spaces-filter-interests-item')

    // make sure dropdown is closed by tapping the heading
    await tapOnElementWithTestId('spaces-filter-modal-heading')

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
    // scroll to header with optons menu
    await scrollToElementWithTestId('space-options-btn', 'up', { maxAttempts: 3 })
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
    await scrollToElementWithTestId('create-space-remove-image-btn', 'down')
    await tapOnElementWithTestId('holi-wizard-next-btn')
  }

  const assertEditingSpace = async () => {
    // check if edit space page has correct information
    await seeTextWithTestId(initialName, 'space-edit-title')
    await scrollToElementWithTestId('space-edit-goal', 'down', { maxAttempts: 2 })
    await seeTextWithTestId(initialGoal, 'space-edit-goal')

    // edit space name and goal
    const editedName = 'e2e edited space name'
    const editedGoal = 'e2e edited space goal'
    await scrollToElementWithTestId('btn-space-edit-name', 'up', { maxAttempts: 2 })
    await tapOnElementWithTestId('btn-space-edit-name')
    await inputSpaceNameAndGoal(editedName, editedGoal)
    await tapOnElementWithTestId('space-edit-modal-save-btn')

    // check if space name and goal were updated
    await seeTextWithTestId(editedName, 'space-edit-title')
    await scrollToElementWithTestId('space-edit-goal', 'down', { maxAttempts: 2 })
    await seeTextWithTestId(editedGoal, 'space-edit-goal')

    await tapOnElementWithTestId('space-edit-close')
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
    await scrollToElementWithTestId('space-name-and-goal-title', 'up', { maxAttempts: 2 })
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
      await Appium.touchAction({ element: unselectedTerms[i], action: 'tap' })
    }
  }

  const inputTaskInfo = async (taskTitle: string, taskDescription: string) => {
    await clickModalSaveButton()
    // choose first option on visibility
    await tapOnElementWithTestId('btn-task-visibility-input')
    await tapOnElementWithTestId('item-task-visibility-input', 0)
    // check if it closed
    await waitForElementWithTestId('btn-task-visibility-input')

    // make sure next input is visible
    await scrollToElementWithTestId('task-name-input', 'down', { maxAttempts: 3 })

    // add task title
    await tapOnElementWithTestId('task-name-input')
    await fillFieldByTestId('task-name-input', taskTitle)

    // click outside to close keyboard
    await tapOnElementWithTestId('task-name-label')

    // scroll down to be able to view input label
    await scrollDown()

    // make sure next input is visible
    await scrollToElementWithTestId('task-description-input', 'down', { maxAttempts: 3 })

    // add task description
    await fillFieldByTestId('task-description-input', taskDescription)

    // click outside to close keyboard
    await tapOnElementWithTestId('task-description-label')

    // scroll down to be able to view input label
    await scrollDown()

    // make sure next input is visible
    await scrollToElementWithTestId('btn-task-locationType', 'down', { maxAttempts: 3 })

    // open locationType dropdown
    await tapOnElementWithTestId('btn-task-locationType')
    await tapOnElementWithTestId('item-task-locationType', 0)

    // make sure next input is visible
    await scrollToElementWithTestId('btn-task-regularity', 'down', { maxAttempts: 3 })

    // scroll down to be able to view input label
    await scrollDown()

    // select commitment level
    await tapOnElementWithTestId('btn-task-regularity')
    await tapOnElementWithTestId('item-task-regularity', 0)
    // check if it closed
    await waitForElementWithTestId('btn-task-regularity')

    // scroll down to be able to view input label
    await scrollDown()

    // make sure next input is visible
    await scrollToElementWithTestId('task-contactEmail-input', 'down', { maxAttempts: 3 })

    // add contact information
    const contactEmail = 'e2e@holi.team'
    await fillFieldByTestId('task-contactEmail-input', contactEmail)

    // click outside to close keyboard
    await tapOnElementWithTestId('task-contactEmail-label')

    await clickModalSaveButton()
  }

  const clickModalSaveButton = async () => {
    const SCREEN_SIZE = await Appium.getWindowRect()
    await Appium.touchAction({ action: 'tap', x: SCREEN_SIZE.width - 60, y: SCREEN_SIZE.height - 80 })
  }

  const assertAddEditDeleteTask = async () => {
    // create task
    const taskTitle = 'E2E task'
    const taskDescription = 'E2E task description'
    await tapOnElementWithTestId('space-tabs-button-2-inactive')
    await scrollToElementWithTestId('btn-right-space-tasks-card', 'down', { maxAttempts: 8 })
    await tapOnElementWithTestId('btn-right-space-tasks-card')
    await inputTaskInfo(taskTitle, taskDescription)

    // edit task
    const editedTaskTitle = 'E2E edited task'
    await tapOnElementWithTestId('btn-task-more-options')
    await tapOnElementWithTestId('btn-to-edit-task')

    // edit task name
    await waitForElementWithTestId('task-name-input')
    await fillFieldByTestId('task-name-input', editedTaskTitle)

    // save edited task
    await tapOnElementWithTestId('form-modal-save-btn')
    // await expect(page.getByText(editedTaskTitle)).toBeVisible()

    // delete task
    await tapOnElementWithTestId('btn-task-more-options')
    await tapOnElementWithTestId('btn-to-delete-task')
    await tapOnElementWithTestId('task-delete-confirmation-confirm')
  }
})
