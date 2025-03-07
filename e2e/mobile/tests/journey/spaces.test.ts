import { continueAsGuest, login, logout } from '../../helpers/auth'
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
      await logout()
    }
  })

  it('should support the user journey', async () => {
    // preparation of test
    await continueAsGuest()
    await navigateToSpaces()

    await assertMultipleGroupsDisplayed()
    await assertSpaceDetailsDisplayed()
    if (platform === 'ios') {
      await assertCreatingSpace()
      await assertEditingSpace()
      await assertCreateDeleteSpaceUpdatePost()
      await assertDeletingSpace()
    }
  })

  const assertMultipleGroupsDisplayed = async () => {
    const groups = await locateMultipleElementsWithTestId('spaces-group-slider')
    expect(groups.length).toBeGreaterThan(0)
    const spaces = await locateMultipleElementsWithTestId('space-link')
    expect(spaces.length).toBeGreaterThan(0)
  }

  const assertSpaceDetailsDisplayed = async () => {
    // click first element on page
    await tapOnElementWithTestId('space-link')

    await waitForElementWithTestId('space-details-container')

    await waitForElementWithTestId('space-header')

    await waitForElementWithTestId('space-avatar')

    await waitForElementWithTestId('space-title')

    await waitForElementWithTestId('btn-to-open-space-collaborators-modal')

    // wait until space details are displayed again
    await waitForElementWithTestId('space-details-container')

    await scrollToElementWithTestId('space-description', 'down', { maxAttempts: 2 })

    await scrollToElementWithTestId('nav-button-back', 'up', { maxAttempts: 2 })
    await tapOnElementWithTestId('nav-button-back')
  }

  const assertCreatingSpace = async () => {
    // login
    await login()

    // on Android, the user gets navigated to spaces and the onboarding modal is opening immediately after login
    await leaveSpaceOnboardingModal()

    await tapOnElementWithTestId('btn-to-spaces')

    await leaveSpaceOnboardingModal()

    await tapOnElementWithTestId('btn-create-space')

    // create space - name and goal
    await checkConfirmButtonIsDisabled()
    await inputSpaceNameAndGoal(initialName, initialGoal)
    await tapOnElementWithTestId('holi-wizard-save-btn')

    // create space - topics
    await checkConfirmButtonIsDisabled()
    await selectSomeTerms(numberOfInitialTerms)
    await tapOnElementWithTestId('holi-wizard-save-btn')

    // create space - cover image
    // We mock the image upload for this test to circumvent using the native file picker, so there already is an image preselected and we can directly continue
    await waitForElementWithTestId('space-upload-image-btn')
    await tapOnElementWithTestId('holi-wizard-save-btn')
  }

  const assertEditingSpace = async () => {
    // check if edit space page has correct information
    await seeTextWithTestId(initialName, 'space-edit-title', 30000)
    await scrollToElementWithTestId('space-edit-goal', 'down', { maxAttempts: 2 })
    await seeTextWithTestId(initialGoal, 'space-edit-goal')

    // edit space name and goal
    const editedName = 'e2e edited space name'
    const editedGoal = 'e2e edited space goal'
    await tapOnElementWithTestId('btn-space-edit-name')
    await inputSpaceNameAndGoal(editedName, editedGoal)
    await tapOnElementWithTestId('space-edit-modal-save-btn')

    // check if space name and goal were updated
    await seeTextWithTestId(editedName, 'space-edit-title')
    await scrollToElementWithTestId('space-edit-goal', 'down', { maxAttempts: 2 })
    await seeTextWithTestId(editedGoal, 'space-edit-goal')

    await tapOnElementWithTestId('space-edit-close')
  }

  const assertCreateDeleteSpaceUpdatePost = async () => {
    // open the space and create an update post
    const postTitle = 'New post title'
    const postDescription = 'This is an update for the new post'

    await tapOnElementWithTestId('space-tabs-button-1-active')
    await tapOnElementWithTestId('space-add-post-button')

    await waitForElementWithTestId('update-title-input-input')
    await fillFieldByTestId('update-title-input-input', postTitle)

    await waitForElementWithTestId('update-content-input-input')
    await fillFieldByTestId('update-content-input-input', postDescription)

    await tapOnElementWithTestId('update-content-input-label')
    await tapOnElementWithTestId('form-wrapper-save-btn')

    // check update post to be shown
    await seeTextWithTestId(postTitle, 'btn-to-post')

    // delete the update post
    await tapOnElementWithTestId('post-three-dot-menu-button')
    await tapOnElementWithTestId('delete-post-button')
    await tapOnElementWithTestId('holi-confirmation-primary')
  }

  const assertDeletingSpace = async () => {
    // delete space
    await tapOnElementWithTestId('space-options-btn')
    await tapOnElementWithTestId('space-delete')
    await tapOnElementWithTestId('space-delete-confirmation-primary')

    // check if after deletion we are at the spaces dashboard (mine/discover)
    await waitForElementWithTestId('btn-create-space')
  }

  const checkConfirmButtonIsDisabled = async () => {
    const nextButton = await waitForElementWithTestId('holi-wizard-save-btn')
    await nextButton.waitForEnabled({ reverse: true })
  }

  const inputSpaceNameAndGoal = async (name: string, goal: string) => {
    await waitForElementWithTestId('space-name-input')
    await waitForElementWithTestId('space-goal-input')
    await fillFieldByTestId('space-goal-input', goal)
    await fillFieldByTestId('space-name-input', name + '\n')
    // Send "\n" at the end of the value  to close the keyboard
    // There is no safe way to close the keyboard on iOS, so it's recommended to do it ourselves
    // https://github.com/appium/appium/issues/15073
  }

  const selectSomeTerms = async (numberOfTermsToSelect = 3) => {
    const unselectedTerms = await locateMultipleElementsWithTestId('terms-list-item')
    const selectedTerms = await locateMultipleElementsWithTestId('terms-list-item-checked')

    // unselect previous terms
    for (let i = 0; i < selectedTerms.length; i++) {
      await Appium.touchAction({ element: selectedTerms[i], action: 'tap' })
    }

    // select new terms
    for (let i = 0; i < numberOfTermsToSelect; i++) {
      await Appium.touchAction({ element: unselectedTerms[i], action: 'tap' })
    }
  }

  const leaveSpaceOnboardingModal = async () => {
    try {
      await tapOnElementWithTestId('space-onboard-content-close-btn', 5_000)
    } catch (_) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
      // try catch in case the onboarding modal is present (depends on asyncstorage)
    }
  }
})
