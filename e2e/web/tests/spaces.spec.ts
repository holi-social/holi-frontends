import { type Browser, type Page, expect, test } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByAriaLabel,
  clickElementByTestId,
  clickFirstElement,
  clickThisOrThatElementByTestId,
  isRunningLocally,
  locateElementByTestId,
  proceedAsGuest,
  waitForAnimationEnd,
  withSSR,
} from '@holi/e2e-web/tests/helpers'
import { inputSpaceNameAndGoal } from '@holi/e2e-web/tests/helpers/spaces'
import { SessionHandler } from '@holi/e2e-web/tests/testmaster'

test.setTimeout(120_000)

test.describe.configure({ mode: 'serial' })
test.describe('@Spaces', () => {
  let guest: Page
  let user: Page

  test.beforeAll(async ({ browser }) => {
    guest = await browser.newPage()

    const api = new SessionHandler(browser)
    const { page: userPage } = await api.signUp()
    user = userPage

    if (process.env.DEBUG) guest.on('console', (msg) => console.debug('  GUEST>', msg.text(), '<')) // eslint-disable-line no-console
    if (process.env.DEBUG) user.on('console', (msg) => console.debug('  ADMIN>', msg.text(), '<')) // eslint-disable-line no-console
  })

  test('guest can explore spaces', async ({ browser }) => {
    await proceedAsGuest(guest)

    await testAccessibleFromHomeScreen(guest)
    await testFiltering(browser, guest)
    await testDisplaysMultipleGroups(guest)

    // open first space displayed
    await clickElementByTestId(guest, 'space-link')
    await testDisplaysSpaceDetails(guest)
  })

  test('user can create, edit and share space', async () => {
    await testCreatingEditingSpace(user)
    await testShareSpace(user)
  })

  test('user can delete their space', async () => {
    await clickElementByTestId(user, 'space-options-btn')
    await clickElementByTestId(user, 'space-delete')
    await clickElementByTestId(user, 'space-delete-confirmation-primary')

    // end up at the spaces dashboard (mine/discover)
    await user.waitForSelector(byTestId('btn-create-space'))
  })

  test.afterAll(async () => {
    await guest.close()
    await user.close()
  })
})

const testAccessibleFromHomeScreen = async (page: Page) => {
  await clickElementByTestId(page, 'btn-to-spaces')
  await clickElementByTestId(page, 'get-started-view-explore-button')
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
  await clickElementByAriaLabel(page, 'filter-modal--open-icon-btn')
  // wait until modal is opened
  await page.locator('[role="dialog"]').waitFor()

  await checkAccessibility(page)

  // select some interest
  await clickElementByTestId(page, 'spaces-filter-interests-input')
  await clickFirstElement(page.getByRole('menuitemcheckbox'))
  await clickElementByTestId(page, 'holi-modal-content-close-btn')

  await testDisplaysFilterResults(page)

  await withSSR(browser, page.url(), testDisplaysFilterResults)

  await clickElementByTestId(page, 'nav-button-back')
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

const testShareSpace = async (page: Page) => {
  await page.waitForSelector(byTestId('toast-SUCCESS'), { state: 'hidden' })

  await clickElementByTestId(page, 'space-share-btn')

  const clipboardText = await page.evaluate('navigator.clipboard.readText()')
  let url = page.url()
  url = url.replace('en/', '') // 'en/' language prefix is not part of the clipboard mechanic apparently
  url = url.substring(0, url.indexOf('?'))
  expect(clipboardText).toContain(url)

  await page.waitForSelector(byTestId('toast-SUCCESS'), { state: 'hidden' })
  await page.waitForSelector(byTestId('space-options-btn'))
}

const saveAndWaitForModalClosed = async (page: Page) => {
  await clickElementByTestId(page, 'space-edit-modal-save-btn')
  await page.waitForSelector(byTestId('space-edit-modal-save-btn'), { state: 'detached' })
}

const numberOfInitialTerms = 1
const numberOfEditedTerms = 2
const initialName = 'e2e space name'
const initialGoal = 'e2e space goal'

const testCreatingEditingSpace = async (page: Page) => {
  await createSpace(page, numberOfInitialTerms, initialName, initialGoal)

  // check if edit space page has correct information
  let editSpaceTitle = await locateElementByTestId(page, 'space-edit-title')
  let editSpaceGoal = await locateElementByTestId(page, 'space-edit-goal')
  await expect(editSpaceTitle).toContainText(initialName)
  await expect(editSpaceGoal).toContainText(initialGoal)

  // edit space name and goal
  const editedName = 'e2e edited space name HELLO THERE'
  const editedGoal = 'e2e edited space goal'
  await clickElementByTestId(page, 'btn-space-edit-name')
  await inputSpaceNameAndGoal(page, editedName, editedGoal)
  await saveAndWaitForModalClosed(page)

  // check if space name and goal were updated
  editSpaceTitle = await locateElementByTestId(page, 'space-edit-title')
  editSpaceGoal = await locateElementByTestId(page, 'space-edit-goal')
  await expect(editSpaceTitle).toContainText(editedName)
  await expect(editSpaceGoal).toContainText(editedGoal)

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
  const topicChips = page.locator(`${byTestId('space-edit-topics-list')} [role="presentation"]`)
  await expect(topicChips.count()).resolves.toBe(numberOfEditedTerms)

  // set location if we have a real geoservice
  if (!isRunningLocally()) {
    const editedLocation = 'Berlin'
    await clickElementByTestId(page, 'btn-space-edit-location')
    await inputSpaceLocation(page, editedLocation)

    await clickFirstElement(page.locator('[role="menuitem"]'))
    await saveAndWaitForModalClosed(page)
  }

  await editSpaceContactInfo(page)

  await clickElementByTestId(page, 'space-edit-close')
  await page.waitForSelector(byTestId('space-edit-close'), { state: 'detached' })

  await testAddEditDeleteTask(page)

  await testAddEditDeleteDigitalTool(page)

  // ensure we are in the whats new tab
  await clickThisOrThatElementByTestId(page, 'space-tabs-button-updates-active', 'space-tabs-button-updates-inactive')

  await testCreateDeleteSpaceUpdatePost(page)
}

const testCreateDeleteSpaceUpdatePost = async (page: Page) => {
  // open the space and create an update post
  const postTitle = 'New post title'
  const postDescription = 'This is an update for the new post'

  await clickElementByTestId(page, 'space-add-post-button')

  const nameInput = await locateElementByTestId(page, 'update-title-input-input')
  await nameInput.fill(postTitle)

  const goalInput = await locateElementByTestId(page, 'update-content-input-input')
  await goalInput.fill(postDescription)

  await clickElementByTestId(page, 'form-wrapper-save-btn')

  // check update post to be shown
  // ensure we are in the what's new tab
  await clickThisOrThatElementByTestId(page, 'space-tabs-button-updates-active', 'space-tabs-button-updates-inactive')
  const title = await locateElementByTestId(page, 'btn-to-post')
  await expect(title).toContainText(postTitle)

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
  const contactEmail = 'e2etest@holi.social'
  const contactPhone = '123456789'

  await clickElementByTestId(page, 'btn-space-edit-contact')

  const contactDescriptionInput = await locateElementByTestId(page, 'space-contact-description-input')
  await contactDescriptionInput.fill(contactDescription)
  const contactPhoneInput = await locateElementByTestId(page, 'space-contact-phone-input')
  await contactPhoneInput.fill(contactPhone)

  // Testing field validation
  // Enter invalid email
  const contactEmailInput = await locateElementByTestId(page, 'space-contact-mail-input')
  await contactEmailInput.fill(contactEmail)
  await saveAndWaitForModalClosed(page)

  // check if space contact was updated
  const contactContainer = await locateElementByTestId(page, 'space-edit-contact')
  await expect(contactContainer).toContainText(contactDescription)
  await expect(contactContainer).toContainText(contactEmail)
  await expect(contactContainer).toContainText(contactPhone)
}

const inputTaskInfo = async (page: Page, taskTitle: string, taskDescription: string) => {
  // choose first option on visibility
  await clickElementByTestId(page, 'btn-task-visibility-input')
  await clickElementByTestId(page, 'item-task-visibility-input-PUBLIC')
  await clickElementByTestId(page, 'task-visibility-input-save-button')
  // then Public entry is visible
  page.getByText('Public')

  const taskTitleInput = await locateElementByTestId(page, 'task-name-input')
  await taskTitleInput.fill(taskTitle)

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
  await clickElementByTestId(page, 'item-task-locationType-ONSITE')
  await clickElementByTestId(page, 'task-locationType-input-save-button')
  // then location type is visible
  page.getByText('On-site')

  // set action start type
  await page.waitForSelector(byTestId('btn-task-interactionType'))
  await clickElementByTestId(page, 'btn-task-interactionType')
  await clickElementByTestId(page, 'item-task-interactionType-CHAT')
  await clickElementByTestId(page, 'task-interactionType-input-save-button')

  // set regularty
  await page.waitForSelector(byTestId('btn-task-regularity-input'))
  await clickElementByTestId(page, 'btn-task-regularity-input')
  await clickElementByTestId(page, 'item-task-regularity-input-ONE_TIME')
  await clickElementByTestId(page, 'task-regularity-input-save-button')

  // set duration
  await page.waitForSelector(byTestId('btn-task-duration-input'))
  await clickElementByTestId(page, 'btn-task-duration-input')
  await clickElementByTestId(page, 'item-task-duration-input-MINUTES_30to60')
  await clickElementByTestId(page, 'task-duration-input-save-button')

  // then regularity is visible
  page.getByText('One time')

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

  // select regularity level
  await clickElementByTestId(page, 'btn-task-regularity-input')
  await clickElementByTestId(page, 'item-task-regularity-input-ONE_TIME')
  await page.getByTestId('holi-container').getByLabel('Save').click()

  await page.getByText('One time')

  // select duration
  await clickElementByTestId(page, 'btn-task-duration-input')
  await clickElementByTestId(page, 'item-task-duration-input-HOURS_1to2')
  await page.getByTestId('holi-container').getByLabel('Save').click()

  await page.getByText('1-2 hours')

  // add thumbnail image
  await page.setInputFiles('input[type="file"]', 'upload/cover_1.png')
  await clickElementByTestId(page, 'form-wrapper-save-btn')

  // wait for save to finish and space to be shown
  // takes a bit of time in a local devmode setup
  await page.waitForSelector(byTestId('space-header'), { timeout: 20_000 })
}

export const selectSomeTerms = async (page: Page, numberOfTermsToSelect = 3) => {
  const locatorForAllTerms = page.locator(`${byTestId('terms-list')} >> [role="switch"]`)
  const locatorForSelectedTerms = page.locator(`${byTestId('terms-list')} >> [role="switch"][aria-checked="true"]`)
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
  await page.waitForSelector(byTestId('task-title'))
  await page.waitForSelector(byTestId('task-description'))
}

const testAddEditDeleteTask = async (page: Page) => {
  // create task
  const taskTitle = 'E2E task'
  const taskDescription = 'E2E task description'

  // ensure we are in the involvement tab
  await clickThisOrThatElementByTestId(
    page,
    'space-tabs-button-involvement-active',
    'space-tabs-button-involvement-inactive'
  )

  await clickElementByTestId(page, 'btn-right-space-tasks-card')
  await checkAccessibility(page)
  await inputTaskInfo(page, taskTitle, taskDescription)

  // check task details
  await expect(page.getByText(taskTitle).first()).toBeVisible()
  await testDisplaysTaskDetails(page)

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
  await clickElementByTestId(page, 'form-wrapper-save-btn')
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
  const numberOfTools = () => page.locator(byTestId('btn-show-tool-details')).count()
  await expect.poll(numberOfTools).toBe(1)

  // Test editing a tool
  await clickElementByTestId(page, 'digital-toolkit-btn')
  const toolEditModal = await locateElementByTestId(page, 'more-options-modal-animatedview')
  await expect(toolEditModal).toBeVisible()
  await clickElementByTestId(page, 'tool-edit-btn') // Edit on modal
  const toolTitleInput = await page.waitForSelector(byTestId('tool-title-input'))
  await toolTitleInput.fill('Edited Tool Name')
  await clickElementByTestId(page, 'form-wrapper-save-btn')
  const editedToolName = await (await locateElementByTestId(page, 'tool-title')).textContent()
  expect(editedToolName).toBe('Edited Tool Name')

  // Test Tool Details Modal
  await clickElementByTestId(page, 'btn-show-tool-details')
  const toolDetailModal = await locateElementByTestId(page, 'tool-details-modal')
  const editButton = await locateElementByTestId(page, 'btn-to-edit-tool')
  const toolUrl = await (await locateElementByTestId(page, 'tool-url-link')).textContent()
  await expect(toolDetailModal).toBeVisible()
  await expect(editButton).toBeVisible()
  expect(toolUrl).toBe('Open https://www.holi.community')
  await clickElementByTestId(page, 'btn-to-close-tool-details-modal')
  await expect(toolDetailModal).not.toBeVisible()

  // Test deleting a tool
  await clickElementByTestId(page, 'digital-toolkit-btn')
  await clickElementByTestId(page, 'tool-delete-btn')
  await clickElementByTestId(page, 'tool-delete-confirmation-primary')
  await expect.poll(numberOfTools).toBe(1)
}

// Create a space with a name, goal, topics and a cover image
const createSpace = async (
  page: Page,
  numberOfTerms = 1,
  initialName = 'e2e space name',
  initialGoal = 'e2e space goal'
) => {
  await clickElementByTestId(page, 'btn-to-spaces')
  // wait for the view to load
  await page.waitForSelector(byTestId('get-started-view-header'))
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
  await selectSomeTerms(page, numberOfTerms)
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
  await clickElementByTestId(page, 'btn-digital-tool-collection')
  await clickElementByTestId(page, 'item-digital-tool-collection-COLLABORATION')
  // check if it closed
  await locateElementByTestId(page, 'btn-digital-tool-collection')

  await clickElementByTestId(page, 'form-wrapper-save-btn')
}
