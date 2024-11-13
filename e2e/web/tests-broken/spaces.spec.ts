import { Browser, Page, expect } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  clickFirstElement,
  locateElementByTestId,
  proceedAsGuest,
  waitForAnimationEnd,
  withSSR,
} from '@holi/e2e-web/tests/helpers'
import { inputSpaceNameAndGoal } from '@holi/e2e-web/tests/helpers/spaces'
import { SessionHandler, test } from '@holi/e2e-web/tests/testmaster'

test.describe('@Spaces', () => {
  test('user journey', async ({ browser, browserName, page, sessions }) => {
    page.on('console', (msg) => console.debug('  BROWSER LOG>', msg.text(), '<'))

    // prepare
    await proceedAsGuest(page)

    await testAccessibleFromHomeScreen(page)

    await testDisplaysMultipleGroups(page)
    await withSSR(browser, page.url(), testDisplaysMultipleGroupsCommon)

    await testFiltering(browser, page)

    // click first element on page
    await clickElementByTestId(page, 'space-link')
    await testDisplaysSpaceDetails(page)
    await withSSR(browser, page.url(), testDisplaysSpaceDetailsCommon)

    await testShareSpace(browserName, page)
    await testCreatingEditingDeletingASpace(browser, sessions)
  })
})

const testAccessibleFromHomeScreen = async (page: Page) => {
  await clickElementByTestId(page, 'btn-to-spaces')

  await expect(page.getByTestId('spaces-container')).toBeVisible({ timeout: 20000 })
  expect(page.url()).toContain('/spaces')
}

const testDisplaysMultipleGroups = async (page: Page) => {
  await testDisplaysMultipleGroupsCommon(page)

  await checkAccessibility(page)
}

const testDisplaysMultipleGroupsCommon = async (page: Page) => {
  const countGroups = async () => await (await locateElementByTestId(page, 'spaces-group-slider')).count()
  const countSpaces = async () => await (await locateElementByTestId(page, 'space-link')).count()

  await page.waitForSelector(byTestId('spaces-container'))

  await expect.poll(countGroups, { timeout: 10000 }).toBeGreaterThan(0)
  await expect.poll(countSpaces, { timeout: 10000 }).toBeGreaterThan(0)
}

const testFiltering = async (browser: Browser, page: Page) => {
  await clickElementByTestId(page, 'spaces-filter-modal--open-btn')
  // wait until modal is opened
  await page.locator('[role="dialog"]').waitFor()

  // select first suggestion for "Hamburg"
  let locationInput = await locateElementByTestId(page, 'spaces-filter-location-input')
  await locationInput.fill('Hamburg')
  await clickFirstElement(page.locator('[role="menuitem"]'))

  await checkAccessibility(page)

  // click filter confirmation button
  await clickElementByTestId(page, 'holi-modal-content-close-btn')

  await testDisplaysFilterResults(page)

  await withSSR(browser, page.url(), testDisplaysFilterResults)

  // reset filter:
  // open filter modal again
  await clickElementByTestId(page, 'spaces-filter-modal--open-btn')
  await page.locator('[role="dialog"]').waitFor()

  // clear location filter
  locationInput = await locateElementByTestId(page, 'spaces-filter-location-input')
  await locationInput.fill('')

  // submit and wait for unfiltered results
  await clickElementByTestId(page, 'holi-modal-content-close-btn')
  await page.waitForSelector(byTestId('spaces-container'))
}

const testDisplaysFilterResults = async (page: Page) => {
  // check if the filtered spaces container is shown
  await page.waitForSelector(byTestId('filtered-spaces-container'))
}

const testDisplaysSpaceDetails = async (page: Page) => {
  await testDisplaysSpaceDetailsCommon(page)

  await clickElementByTestId(page, 'btn-to-open-space-collaborators-modal')
  // wait until modal is opened
  await page.locator('[role="dialog"]').waitFor()

  // check if space collaborator is displayed
  await page.waitForSelector(byTestId('spaces-collaborators-item'))

  // close modal and wait until closed
  await clickElementByTestId(page, 'btn-to-close-space-collaborators-modal')
  await page.waitForSelector(byTestId('btn-to-open-space-collaborators-modal'))

  await checkAccessibility(page)

  const spaceUrlPrefix = '/spaces/'
  expect(page.url()).toContain(spaceUrlPrefix)
}

const testDisplaysSpaceDetailsCommon = async (page: Page) => {
  await page.waitForSelector(byTestId('space-details-container'))

  await page.waitForSelector(byTestId('space-header'))

  await page.waitForSelector(byTestId('space-avatar'))

  await page.waitForSelector(byTestId('space-title'))

  await page.waitForSelector(byTestId('space-description'))
}

const testShareSpace = async (browserName: string, page: Page) => {
  // open space share modal
  await page.waitForSelector(byTestId('toast-SUCCESS'), { state: 'hidden' })
  await clickElementByTestId(page, 'space-share-btn')

  // There is no dedicated PlayWright API for the clipboard yet and the following currently only works in chrome, see https://github.com/microsoft/playwright/issues/15860
  if (browserName === 'chromium') {
    // check if shared link is correct
    const clipboardText = await page.evaluate('navigator.clipboard.readText()')
    const url = page.url()
    expect(clipboardText).toContain(url.substring(0, url.indexOf('?')))
  }

  // expect success toast
  await page.waitForSelector(byTestId('toast-SUCCESS'), { state: 'hidden' })
  await page.waitForSelector(byTestId('space-options-btn'))
}

const saveAndWaitForModalClosed = async (page: Page) => {
  await Promise.all([
    page.waitForSelector(byTestId('space-edit-modal-save-btn'), { state: 'detached' }),
    clickElementByTestId(page, 'space-edit-modal-save-btn'),
  ])
}

const numberOfInitialTerms = 3
const numberOfEditedTerms = 2
const initialName = 'e2e space name'
const initialGoal = 'e2e space goal'

const testCreatingEditingDeletingASpace = async (browser: Browser, sessions: SessionHandler) => {
  const { page } = await sessions.signUp()

  await createSpace(page, numberOfInitialTerms, initialName, initialGoal)

  // check if edit space page has correct information
  let editSpaceTitle = await locateElementByTestId(page, 'space-edit-title')
  let editSpaceGoal = await locateElementByTestId(page, 'space-edit-goal')
  expect(editSpaceTitle).toContainText(initialName)
  expect(editSpaceGoal).toContainText(initialGoal)

  // edit space name and goal
  const editedName = 'e2e edited space name HELLO THERE'
  const editedGoal = 'e2e edited space goal'
  await clickElementByTestId(page, 'btn-space-edit-name')
  await inputSpaceNameAndGoal(page, editedName, editedGoal)
  await saveAndWaitForModalClosed(page)

  // check if space name and goal were updated
  editSpaceTitle = await locateElementByTestId(page, 'space-edit-title')
  editSpaceGoal = await locateElementByTestId(page, 'space-edit-goal')
  expect(editSpaceTitle).toContainText(editedName)
  expect(editSpaceGoal).toContainText(editedGoal)

  // edit space avatar
  await clickElementByTestId(page, 'btn-space-edit-avatar')
  await page.setInputFiles('input[type="file"]', 'upload/avatar.png')
  await saveAndWaitForModalClosed(page)

  // edit space cover image
  await clickElementByTestId(page, 'btn-space-edit-cover')
  await page.setInputFiles('input[type="file"]', 'upload/cover_2.png')
  await saveAndWaitForModalClosed(page)

  // edit space topics
  await clickElementByTestId(page, 'btn-space-edit-topics')
  await waitForAnimationEnd(page, byTestId('space-chips-modal-animatedview'))
  await selectSomeTerms(page, numberOfEditedTerms)
  await saveAndWaitForModalClosed(page)

  // check if the correct number of topics have been selected
  const numberOfEditedTopics = () => page.locator(byTestId('space-edit-topics-chip')).count()
  await expect.poll(numberOfEditedTopics).toBe(numberOfEditedTerms)

  // edit space - update location
  const editedLocation = 'Berlin'
  await clickElementByTestId(page, 'btn-space-edit-location')
  await inputSpaceLocation(page, editedLocation)

  // expect suggestions
  await clickFirstElement(page.locator('[role="menuitem"]'))
  await saveAndWaitForModalClosed(page)

  // edit space sdgs
  await clickElementByTestId(page, 'btn-space-edit-sdgs')
  await waitForAnimationEnd(page, byTestId('space-chips-modal-animatedview'))
  await selectSomeTerms(page, numberOfEditedTerms)
  await saveAndWaitForModalClosed(page)

  // check if the correct number of sdgs have been selected
  const numberOfEditedSdgs = () => page.locator(byTestId('space-edit-sdgs-chip')).count()
  await expect.poll(numberOfEditedSdgs).toBe(numberOfEditedTerms)

  // edit space contact info
  await editSpaceContactInfo(page)

  await clickElementByTestId(page, 'space-edit-close')

  await testAddEditDeleteTask(browser, page)

  // test digital tools
  await testAddEditDeleteDigitalTool(page)

  await page.waitForSelector(byTestId('toast-SUCCESS'), { state: 'hidden' })

  // test Update Post creation and deletion
  await testCreateDeleteSpaceUpdatePost(page)

  // delete space
  await page.waitForSelector(byTestId('toast-SUCCESS'), { state: 'hidden' })
  await clickElementByTestId(page, 'space-options-btn')
  await clickElementByTestId(page, 'space-delete')
  await clickElementByTestId(page, 'space-delete-confirmation-primary')

  await page.waitForSelector(byTestId('toast-SUCCESS'), { state: 'hidden' })

  // check if after deletion we are at the spaces dashboard (mine/discover)
  await page.waitForSelector(byTestId('btn-create-space'))
}

const testCreateDeleteSpaceUpdatePost = async (page: Page) => {
  // open the space and create an update post
  const postTitle = 'New post title'
  const postDescription = 'This is an update for the new post'

  await clickElementByTestId(page, 'space-tabs-button-1-inactive')

  // !!! It's a bad pattern to add a delay in tests !!!
  // But we currently don't have any more ideas how we can fix the issue
  // The app does not respond properly, when the button is pressed too quickly
  // This can keep the test green until we know how to fix the underlying issue
  await new Promise((resolve) => setTimeout(resolve, 600))

  await clickElementByTestId(page, 'space-add-post-button')

  const nameInput = await locateElementByTestId(page, 'update-title-input-input')
  await nameInput.fill(postTitle)

  const goalInput = await locateElementByTestId(page, 'update-content-input-input')
  await goalInput.fill(postDescription)

  await clickElementByTestId(page, 'form-modal-save-btn')

  // check update post to be shown
  const title = await locateElementByTestId(page, 'btn-to-post')
  expect(title).toContainText(postTitle)

  // delete the update post
  await clickElementByTestId(page, 'post-three-dot-menu-button')
  await clickElementByTestId(page, 'delete-post-button')
  await clickElementByTestId(page, 'holi-confirmation-primary')

  // wait for the update post to disappear
  await page.waitForSelector(byTestId('btn-to-post'), { state: 'detached' })
}

export const checkConfirmButtonIsDisabled = async (page: Page) => {
  const nextButton = await locateElementByTestId(page, 'holi-wizard-save-btn')
  await nextButton.isDisabled()
}

const editSpaceContactInfo = async (page: Page) => {
  const contactDescription = 'e2e edited space description'
  const contactEmail = 'test@email.com'
  const contactPhone = '123456789'

  await clickElementByTestId(page, 'btn-space-edit-contact')

  const contactDescriptionInput = await locateElementByTestId(page, 'space-contact-description-input')
  await contactDescriptionInput.fill(contactDescription)
  const contactPhoneInput = await locateElementByTestId(page, 'space-contact-phone-input')
  await contactPhoneInput.fill(contactPhone)

  // Testing field validation
  // Enter invalid email
  const contactEmailInput = await locateElementByTestId(page, 'space-contact-mail-input')
  await contactEmailInput.fill('"@example.com')
  // Expect frontend validation error
  const errorMessageTestId = byTestId('space-contact-mail-input-error-message')
  await page.waitForSelector(errorMessageTestId)
  // Enter email that is valid for frontend but invalid for backend
  await contactEmailInput.fill('" "@example.com')
  // Expect frontend validation error to be gone
  page.waitForSelector(errorMessageTestId, { state: 'detached' })
  // Try to save contact
  clickElementByTestId(page, 'space-edit-modal-save-btn')
  // Expect backend validation error
  await page.waitForSelector(errorMessageTestId)

  // Enter valid email and save
  await contactEmailInput.fill(contactEmail)
  await saveAndWaitForModalClosed(page)

  // check if space contact was updated
  const contactContainer = await locateElementByTestId(page, 'space-edit-contact')
  expect(contactContainer).toContainText(contactDescription)
  expect(contactContainer).toContainText(contactEmail)
  expect(contactContainer).toContainText(contactPhone)
}

const inputTaskInfo = async (page: Page, taskTitle: string, taskDescription: string) => {
  // choose first option on visibility
  await clickElementByTestId(page, 'btn-task-visibility-input')
  await clickElementByTestId(page, 'item-task-visibility-input', 0)
  // check if it closed
  await locateElementByTestId(page, 'btn-task-visibility-input')

  // make sure previous modal is closed
  await page.waitForSelector(byTestId('btn-to-close-task-visibility-input'), { state: 'hidden' })

  // add task title
  const taskTitleInput = await locateElementByTestId(page, 'task-name-input')
  await taskTitleInput.fill(taskTitle)

  // add task description
  const taskDescriptionInput = await locateElementByTestId(page, 'task-description-input')
  await taskDescriptionInput.fill(taskDescription)

  // select some skills
  await clickElementByTestId(page, 'btn-task-edit-skills-modal')
  await waitForAnimationEnd(page, byTestId('task-skills-modal-animatedview'))
  await selectSomeTerms(page, 1)
  await clickElementByTestId(page, 'create-task-skills-modal-wrapper-close-btn')

  // make sure previous modal is closed
  await page.waitForSelector(byTestId('create-task-skills-modal-wrapper-close-btn'), { state: 'hidden' })

  // open locationType dropdown
  await page.waitForSelector(byTestId('btn-task-locationType'))
  await clickElementByTestId(page, 'btn-task-locationType')
  await clickElementByTestId(page, 'item-task-locationType', 0)
  // check if it closed
  await locateElementByTestId(page, 'btn-task-locationType')

  // make sure previous modal is closed
  await page.waitForSelector(byTestId('btn-to-close-task-locationType'), { state: 'hidden' })

  // select location
  const locationInput = await locateElementByTestId(page, 'task-location-input')
  await locationInput.fill('Hamburg')

  // add contact information
  const contactEmail = 'e2e@holi.team'
  const contactPhone = '+49 164 4344 434'
  const taskContactEmail = await locateElementByTestId(page, 'task-contactEmail-input')
  await clickElementByTestId(page, 'task-contactEmail-input')
  await taskContactEmail.fill(contactEmail)
  const taskContactPhone = await locateElementByTestId(page, 'task-contactPhone-input')
  await taskContactPhone.fill(contactPhone)

  // select commitment level
  await page.waitForSelector(byTestId('btn-task-regularity'))
  await clickElementByTestId(page, 'btn-task-regularity')
  await clickElementByTestId(page, 'item-task-regularity', 0)
  // check if it closed
  await locateElementByTestId(page, 'btn-task-regularity')

  // add thumbnail image
  await page.setInputFiles('input[type="file"]', 'upload/cover_1.png')

  await clickElementByTestId(page, 'form-modal-save-btn')
  // wait for save to finish and space to be shown
  await page.waitForSelector(byTestId('space-header'))
}

export const selectSomeTerms = async (page: Page, numberOfTermsToSelect = 3) => {
  const locatorForAllTerms = page.locator(`${byTestId('space-terms-list')} >> [role="switch"]`)
  const locatorForSelectedTerms = page.locator(
    `${byTestId('space-terms-list')} >> [role="switch"][aria-checked="true"]`
  )
  const numberOfTotalTerms = await locatorForAllTerms.count()
  const numberOfInitiallySelectedTerms = await locatorForSelectedTerms.count()

  // unselect all
  for (let i = 1; i <= numberOfInitiallySelectedTerms; i++) {
    await locatorForSelectedTerms.nth(0).click()
    // wait until the click is handled
    await expect.poll(() => locatorForSelectedTerms.count()).toBe(numberOfInitiallySelectedTerms - i)
  }

  // select new terms
  for (let i = 1; i <= numberOfTermsToSelect; i++) {
    // the selected terms are always sorted as first, so we select the last ones to avoid unselection
    await locatorForAllTerms.nth(numberOfTotalTerms - 1).click()
    // wait until the click is handled
    await expect.poll(() => locatorForSelectedTerms.count()).toBe(i)
  }
}

const inputSpaceLocation = async (page: Page, location: string) => {
  const locationInput = await locateElementByTestId(page, 'spaces-location-input')
  await locationInput.fill(location)
}

const testDisplaysTaskDetails = async (page: Page) => {
  await page.waitForSelector(byTestId('space-task-tile'))
  await page.waitForSelector(byTestId('task-title'))
  await page.waitForSelector(byTestId('task-description'))
}

const testAddEditDeleteTask = async (browser: Browser, page: Page) => {
  // create task
  const taskTitle = 'E2E task'
  const taskDescription = 'E2E task description'
  await clickElementByTestId(page, 'space-tabs-button-involvement-inactive')

  // !!! It's a bad pattern to add a delay in tests !!!
  // But we currently don't have any more ideas how we can fix the issue
  // The app does not respond properly, when the button is pressed too quickly
  // This can keep the test green until we know how to fix the underlying issue
  await new Promise((resolve) => setTimeout(resolve, 300))

  await clickElementByTestId(page, 'btn-right-space-tasks-card')
  await checkAccessibility(page)
  await inputTaskInfo(page, taskTitle, taskDescription)

  // check task details
  await expect(page.getByText(taskTitle).first()).toBeVisible()
  await testDisplaysTaskDetails(page)
  withSSR(browser, page.url(), testDisplaysTaskDetails)

  // edit task
  const editedTaskTitle = 'E2E edited task'
  const editedTaskDescription = 'E2E edited description'
  await clickElementByTestId(page, 'btn-task-more-options')
  await clickElementByTestId(page, 'btn-to-edit-task')
  await checkAccessibility(page)

  // edit task title
  const taskTitleInput = await locateElementByTestId(page, 'task-name-input')
  await taskTitleInput.fill(editedTaskTitle)

  // edit task description
  const taskDescriptionInput = await locateElementByTestId(page, 'task-description-input')
  await taskDescriptionInput.fill(editedTaskDescription)

  // save edited task
  await clickElementByTestId(page, 'form-modal-save-btn')
  await expect(page.getByText(editedTaskTitle).first()).toBeVisible()

  // delete task
  await clickElementByTestId(page, 'btn-task-more-options')
  await clickElementByTestId(page, 'btn-to-delete-task')
  await clickElementByTestId(page, 'task-delete-confirmation-primary')
  await page.waitForSelector(byTestId('task-delete-confirmation-primary'), { state: 'hidden' })
}

const testAddEditDeleteDigitalTool = async (page: Page) => {
  // Test adding a tool from a space's Get Involved tab
  await clickElementByTestId(page, 'btn-right-space-tools-card') // Little + button
  await createDigitalTool(page)
  const toolIcon = await locateElementByTestId(page, 'tool-icon')
  const toolName = await locateElementByTestId(page, 'tool-title')
  const toolContextBtn = await locateElementByTestId(page, 'digital-toolkit-btn')
  await expect(toolIcon).toBeVisible()
  await expect(toolName).toBeVisible()
  await expect(toolContextBtn).toBeVisible()
  let numberOfTools = () => page.locator(byTestId('btn-show-tool-details')).count()
  await expect.poll(numberOfTools).toBe(1)

  // Test adding a tool from the Linkhub
  await clickElementByTestId(page, 'btn-left-space-tools-card')
  await clickElementByTestId(page, 'space-add-tool-button') // Big yellow + button
  await createDigitalTool(page)

  await page.waitForSelector(byTestId('form-modal-save-btn'), { state: 'hidden' })
  await clickElementByTestId(page, 'nav-button-back')
  numberOfTools = () => page.locator(byTestId('btn-show-tool-details')).count()
  await expect.poll(numberOfTools).toBe(2)

  // Test deleting a tool
  await clickElementByTestId(page, 'digital-toolkit-btn')
  await clickElementByTestId(page, 'tool-delete-btn')
  await clickElementByTestId(page, 'tool-delete-confirmation-primary')
  await expect.poll(numberOfTools).toBe(1)

  // Test Tool Details Modal
  await clickElementByTestId(page, 'btn-show-tool-details')
  const toolDetailModal = await locateElementByTestId(page, 'tool-details-modal')
  const editButton = await locateElementByTestId(page, 'btn-to-edit-tool')
  const toolUrl = await (await locateElementByTestId(page, 'tool-url-link')).textContent()
  await expect(toolDetailModal).toBeVisible()
  await expect(editButton).toBeVisible()
  await expect(toolUrl).toBe('Open https://www.holi.community')
  await clickElementByTestId(page, 'btn-to-close-tool-details-modal')
  await expect(toolDetailModal).not.toBeVisible()

  // Test editing a tool
  await clickElementByTestId(page, 'digital-toolkit-btn')
  const toolEditModal = await locateElementByTestId(page, 'more-options-modal-animatedview')
  await expect(toolEditModal).toBeVisible()
  await clickElementByTestId(page, 'tool-edit-btn') // Edit on modal
  const toolTitleInput = await page.waitForSelector(byTestId('tool-title-input'))
  await toolTitleInput.fill('Edited Tool Name')
  await clickElementByTestId(page, 'form-modal-save-btn')
  const editedToolName = await (await locateElementByTestId(page, 'tool-title')).textContent()
  await expect(editedToolName).toBe('Edited Tool Name')
}

// Create a space with a name, goal, topics and a cover image
const createSpace = async (
  page: Page,
  numberOfInitialTerms = 3,
  initialName = 'e2e space name',
  initialGoal = 'e2e space goal'
) => {
  await clickElementByTestId(page, 'btn-to-spaces')
  await clickElementByTestId(page, 'btn-create-space')
  // wait until page is loaded
  await page.waitForSelector(byTestId('holi-wizard-save-btn'))

  // Create space - name and goal
  await checkAccessibility(page)
  await checkConfirmButtonIsDisabled(page)
  await inputSpaceNameAndGoal(page, initialName, initialGoal)
  await clickElementByTestId(page, 'holi-wizard-save-btn')

  // Create space - topics
  await checkAccessibility(page)
  await checkConfirmButtonIsDisabled(page)
  await selectSomeTerms(page, numberOfInitialTerms)
  await clickElementByTestId(page, 'holi-wizard-save-btn')

  // Create space - cover image
  await checkAccessibility(page)
  await checkConfirmButtonIsDisabled(page)
  await page.setInputFiles('input[type="file"]', 'upload/cover_1.png')
  await clickElementByTestId(page, 'holi-wizard-save-btn')
  await clickElementByTestId(page, 'space-onboard-content-close-btn')
}

// Add a digital tool to a space (Linkhub)
const createDigitalTool = async (
  page: Page,
  url = 'https://www.holi.community',
  name = 'Team Chat',
  desc = 'A Place for our Community'
) => {
  await checkAccessibility(page)
  const toolUrlInput = await page.waitForSelector(byTestId('tool-url-input'))
  const toolTitleInput = await page.waitForSelector(byTestId('tool-title-input'))
  const toolDescriptionInput = await page.waitForSelector(byTestId('tool-description-input'))
  await toolUrlInput.fill(url)
  await toolTitleInput.fill(name)
  await toolDescriptionInput.fill(desc)

  // select collection
  await page.waitForSelector(byTestId('btn-digital-tool-collection'))
  await clickElementByTestId(page, 'btn-digital-tool-collection')
  await clickElementByTestId(page, 'item-digital-tool-collection', 0)
  // check if it closed
  await locateElementByTestId(page, 'btn-digital-tool-collection')

  await clickElementByTestId(page, 'form-modal-save-btn')
}
