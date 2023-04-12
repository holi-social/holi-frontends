import { BrowserContext, Page, expect } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElement,
  clickElementByTestId,
  locateElementByTestId,
  proceedAsGuest,
} from './helpers'
import { UserHandler, test } from './testmaster'

test.setTimeout(180000)

test.describe('@Spaces', () => {
  test('user journey', async ({ context, page, userHandler }) => {
    // prepare
    await proceedAsGuest(page)

    await testAccessibleFromHomeScreen(page)
    await testDisplaysMultipleGroups(page)
    await testFiltering(page)
    await testDisplaysSpaceDetails(page)
    await testShareSpace(page)
    await testCreatingEditingDeletingASpace(context, page, userHandler)
    await testAddEditDeleteDigitalTool(page, userHandler)
  })
})
const testAccessibleFromHomeScreen = async (page: Page) => {
  await clickElementByTestId(page, 'btn-to-spaces')

  await expect(page.getByTestId('spaces-container')).toBeVisible({ timeout: 20000 })
  expect(page.url()).toContain('/spaces')
}

const testDisplaysMultipleGroups = async (page: Page) => {
  const countGroups = async () => await (await locateElementByTestId(page, 'spaces-group-slider')).count()
  const countSpaces = async () => await (await locateElementByTestId(page, 'space-link')).count()

  await page.waitForSelector(byTestId('spaces-container'))

  await expect.poll(countGroups, { timeout: 10000 }).toBeGreaterThan(0)
  await expect.poll(countSpaces, { timeout: 10000 }).toBeGreaterThan(0)

  await checkAccessibility(page)
}

const testFiltering = async (page: Page) => {
  await clickElementByTestId(page, 'btn-filter-spaces')

  const locationInput = await locateElementByTestId(page, 'spaces-filter-location-input')
  await locationInput.fill('nwqekjnk23jn4k23')

  await checkAccessibility(page)

  // close skills dropdown
  await clickElementByTestId(page, 'spaces-filter-skills-toggle-menu')

  // click filter confirmation button and check if we are in the correct page with the filter queries
  await Promise.all([
    clickElementByTestId(page, 'holi-modal-content-close-btn'),
    page.waitForNavigation({ url: '**/spaces/**' }),
  ])

  // check if the filtered spaces container is shown
  await page.waitForSelector(byTestId('filtered-spaces-container'))

  // reset the filter and wait for it
  await clickElementByTestId(page, 'spaces-filter-reset')
  await page.waitForSelector(byTestId('spaces-container'))
}

const testDisplaysSpaceDetails = async (page: Page) => {
  // click first element on page
  await clickElementByTestId(page, 'space-link')

  await page.waitForSelector(byTestId('space-details-container'))

  await page.waitForSelector(byTestId('space-header'))

  await page.waitForSelector(byTestId('space-avatar'))

  await page.waitForSelector(byTestId('space-title'))

  await page.waitForSelector(byTestId('space-description'))

  await clickElementByTestId(page, 'btn-to-open-space-collaborators-modal')

  // check if on click the user profile is displayed
  await page.waitForSelector(byTestId('spaces-collaborators-item'))

  await clickElementByTestId(page, 'btn-to-close-space-collaborators-modal')

  await checkAccessibility(page)

  const spaceUrlPrefix = '/spaces/'
  expect(page.url()).toContain(spaceUrlPrefix)
}

const testShareSpace = async (page: Page) => {
  // open space share modal
  await clickElementByTestId(page, 'space-options-btn')
  await clickElementByTestId(page, 'space-share-btn')

  //check if shared link is correct
  const spaceShareLink = await locateElementByTestId(page, 'space-share-link')
  const spaceShareLinkText = await spaceShareLink.innerText()
  expect(spaceShareLinkText).toBe(page.url())

  // copy link and close modal / options
  await clickElementByTestId(page, 'space-share-url-btn')
  await page.waitForSelector(byTestId('space-options-btn'))
  await clickElementByTestId(page, 'btn-to-close-more-options-modal-modal')
}

const testCreatingEditingDeletingASpace = async (context: BrowserContext, page: Page, userHandler: UserHandler) => {
  const numberOfInitialTerms = 3
  const numberOfEditedTerms = 2
  const initialName = 'e2e space name'
  const initialGoal = 'e2e space goal'

  // create the space as a random user, so it gets cleaned up together with the user after the test, even if it fails
  await userHandler.asRandomUser(async (page) => {
    await createSpace(page, numberOfInitialTerms, initialName, initialGoal)

    // check if edit space page has correct information
    let editSpaceTitle = await locateElementByTestId(page, 'space-edit-title')
    let editSpaceGoal = await locateElementByTestId(page, 'space-edit-goal')
    expect(editSpaceTitle).toContainText(initialName)
    expect(editSpaceGoal).toContainText(initialGoal)

    const saveAndWaitForModalClosed = async (page: Page) => {
      await Promise.all([
        page.waitForSelector(byTestId('space-edit-modal-save-btn'), { state: 'detached' }),
        clickElementByTestId(page, 'space-edit-modal-save-btn'),
      ])
    }

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
    await clickElement(page.locator('[role="menuitem"]'))
    await saveAndWaitForModalClosed(page)

    // edit space sdgs
    await clickElementByTestId(page, 'btn-space-edit-sdgs')
    await selectSomeTerms(page, numberOfEditedTerms)
    await saveAndWaitForModalClosed(page)

    // check if the correct number of sdgs have been selected
    const numberOfEditedSdgs = () => page.locator(byTestId('space-edit-sdgs-chip')).count()
    await expect.poll(numberOfEditedSdgs).toBe(numberOfEditedTerms)

    // edit space contact info
    const editedDescription = 'e2e edited space description'
    const editedEmail = 'test@email.com'
    const editedPhone = '123456789'
    await clickElementByTestId(page, 'btn-space-edit-contact')
    await inputSpaceContactInfo(page, editedDescription, editedEmail, editedPhone)
    await saveAndWaitForModalClosed(page)

    // create task
    const taskTitle = 'E2E task title'
    const taskDescription = 'E2E task description'
    await clickElementByTestId(page, 'space-edit-close')
    await clickElementByTestId(page, 'space-tabs-button-2-inactive')
    await clickElementByTestId(page, 'btn-right-space-tasks-card')
    await checkAccessibility(page)
    await inputTaskInfo(page, taskTitle, taskDescription)

    // delete space
    await clickElementByTestId(page, 'space-options-btn')
    await clickElementByTestId(page, 'space-delete-btn')
    await clickElementByTestId(page, 'space-delete-confirmation-confirm')

    // check if after deletion we are at the spaces dashboard (mine/discover)
    await page.waitForSelector(byTestId('btn-create-space'))
  })
}

const checkConfirmButtonIsDisabled = async (page: Page) => {
  const nextButton = await locateElementByTestId(page, 'holi-wizard-next-btn')
  await nextButton.isDisabled()
}

const inputSpaceNameAndGoal = async (page: Page, name: string, goal: string) => {
  const nameInput = await locateElementByTestId(page, 'space-name-input')
  await nameInput.fill(name)

  const goalInput = await locateElementByTestId(page, 'space-goal-input')
  await goalInput.fill(goal)
}

const inputSpaceContactInfo = async (
  page: Page,
  contactDescription: string,
  contactEmail: string,
  contactPhone: string
) => {
  const contactDescriptionInput = await locateElementByTestId(page, 'space-contact-description-input')
  await contactDescriptionInput.fill(contactDescription)

  const contactEmailInput = await locateElementByTestId(page, 'space-contact-mail-input')
  await contactEmailInput.fill(contactEmail)

  const contactPhoneInput = await locateElementByTestId(page, 'space-contact-phone-input')
  await contactPhoneInput.fill(contactPhone)
}

const inputTaskInfo = async (page: Page, taskTitle: string, taskDescription: string) => {
  // choose first option on visibility
  await clickElementByTestId(page, 'btn-task-visibility-input')
  await clickElementByTestId(page, 'item-task-visibility-input', 0)
  await clickElementByTestId(page, 'btn-to-close-task-visibility-input-modal')
  // check if it closed
  await locateElementByTestId(page, 'btn-task-visibility-input')

  // make sure previous modal is closed
  await page.waitForSelector(byTestId('btn-to-close-task-visibility-input-modal'), { state: 'hidden' })

  // add task title
  const taskTitleInput = await locateElementByTestId(page, 'task-name-input')
  await taskTitleInput.fill(taskTitle)

  // add task description
  const taskDescriptionInput = await locateElementByTestId(page, 'task-description-input')
  await taskDescriptionInput.fill(taskDescription)

  // select some skills
  await clickElementByTestId(page, 'btn-task-edit-skills-modal')
  await selectSomeTerms(page, 1)
  await clickElementByTestId(page, 'create-task-skills-modal-wrapper-close-btn')

  // make sure previous modal is closed
  await page.waitForSelector(byTestId('create-task-skills-modal-wrapper-close-btn'), { state: 'hidden' })

  // open locationType dropdown
  await clickElementByTestId(page, 'task-visibility-title')
  await page.waitForSelector(byTestId('task-locationType-input'))
  await clickElementByTestId(page, 'task-locationType-input')

  // click on first locationType in the list
  await clickElementByTestId(page, 'task-locationType-item')

  // select location
  const locationInput = await locateElementByTestId(page, 'task-location-input')
  await locationInput.fill('Hamburg')
  // expect suggestions
  await clickElement(page.locator('[role="menuitem"]'))

  // select commitment level
  const commitmentLevelInput = await locateElementByTestId(page, 'task-regularity-input')
  await commitmentLevelInput.fill('Regularly')
  // expect suggestions
  await clickElementByTestId(page, 'task-regularity-item', 0)

  // add contact information
  const contactEmail = 'e2e@holi.team'
  const contactPhone = '+49 164 4344 434'
  const taskContactEmail = await locateElementByTestId(page, 'task-contactEmail-input')
  await taskContactEmail.fill(contactEmail)
  const taskContactPhone = await locateElementByTestId(page, 'task-contactPhone-input')
  await taskContactPhone.fill(contactPhone)

  // add thumbnail image
  await page.setInputFiles('input[type="file"]', 'upload/cover_1.png')

  await clickElementByTestId(page, 'create-task-modal-save-btn')
}

const selectSomeTerms = async (page: Page, numberOfTermsToSelect = 3) => {
  const locatorForAllTerms = page.locator(`${byTestId('space-terms-list')} >> [role="checkbox"]`)
  const locatorForSelectedTerms = page.locator(
    `${byTestId('space-terms-list')} >> [role="checkbox"][aria-checked="true"]`
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

const testAddEditDeleteDigitalTool = async (page: Page, userHandler: UserHandler) => {
  await userHandler.asRandomUser(async (page) => {
    await createSpace(page)
    await checkAccessibility(page)
    await clickElementByTestId(page, 'space-edit-close')

    // Test adding a tool from a space's Get Involved tab
    await clickElementByTestId(page, 'space-tabs-button-2-inactive') // Get involved
    await clickElementByTestId(page, 'btn-right-collaboration-area-card') // Little + button
    await addDigitalTool(page)
    const toolIcon = await locateElementByTestId(page, 'tool-icon')
    const toolName = await locateElementByTestId(page, 'tool-title')
    const toolContextBtn = await locateElementByTestId(page, 'digital-toolkit-btn')
    await expect(toolIcon).toBeVisible()
    await expect(toolName).toBeVisible()
    await expect(toolContextBtn).toBeVisible()
    let numberOfTools = () => page.locator(byTestId('btn-show-tool-details')).count()
    await expect.poll(numberOfTools).toBe(1)

    // Test adding a tool from the Linkhub
    await clickElementByTestId(page, 'space-resources-add-button') // Toolkit
    await clickElementByTestId(page, 'resource-category-tile-digital-tool') // Linkhub
    await clickElementByTestId(page, 'space-add-tool-button') // Big yellow + button
    await addDigitalTool(page)
    await clickElementByTestId(page, 'nav-button-back')
    numberOfTools = () => page.locator(byTestId('btn-show-tool-details')).count()
    await expect.poll(numberOfTools).toBe(2)

    // Test deleting a tool
    await clickElementByTestId(page, 'digital-toolkit-btn')
    await clickElementByTestId(page, 'tool-delete-btn')
    await clickElementByTestId(page, 'tool-delete-confirmation-confirm')
    await expect.poll(numberOfTools).toBe(1)

    // Test Tool Details Modal
    await clickElementByTestId(page, 'btn-show-tool-details')
    const toolDetailModal = await locateElementByTestId(page, 'tool-details-modal')
    const editButton = await locateElementByTestId(page, 'btn-to-edit-tool')
    const toolUrl = await (await locateElementByTestId(page, 'text-link')).textContent()
    await expect(toolDetailModal).toBeVisible()
    await expect(editButton).toBeVisible()
    await expect(toolUrl).toBe('Open https://www.holi.community')
    await clickElementByTestId(page, 'btn-to-close-tool-details-modal-modal')
    await expect(toolDetailModal).not.toBeVisible()

    // Test editing a tool
    await clickElementByTestId(page, 'digital-toolkit-btn')
    const toolEditModal = await locateElementByTestId(page, 'more-options-modal-animatedview')
    await expect(toolEditModal).toBeVisible()
    await clickElementByTestId(page, 'tool-edit-btn') // Edit on modal
    const toolTitleInput = await page.waitForSelector(byTestId('tool-title-input'))
    await toolTitleInput.fill('Edited Tool Name')
    await clickElementByTestId(page, `digital-tool-edit-modal-save-btn`)
    const editedToolName = await (await locateElementByTestId(page, 'tool-title')).textContent()
    await expect(editedToolName).toBe('Edited Tool Name')
  })
}

// Create a space with a name, goal, topics and a cover image
const createSpace = async (
  page: Page,
  numberOfInitialTerms: number = 3,
  initialName: string = 'e2e space name',
  initialGoal: string = 'e2e space goal'
) => {
  await clickElementByTestId(page, 'btn-to-spaces')
  await clickElementByTestId(page, 'btn-create-space')

  // Create space - name and goal
  await checkAccessibility(page)
  await checkConfirmButtonIsDisabled(page)
  await inputSpaceNameAndGoal(page, initialName, initialGoal)
  await clickElementByTestId(page, 'holi-wizard-next-btn')

  // Create space - topics
  await checkAccessibility(page)
  await checkConfirmButtonIsDisabled(page)
  await selectSomeTerms(page, numberOfInitialTerms)
  await clickElementByTestId(page, 'holi-wizard-next-btn')

  // Create space - cover image
  await checkAccessibility(page)
  await checkConfirmButtonIsDisabled(page)
  await page.setInputFiles('input[type="file"]', 'upload/cover_1.png')
  await clickElementByTestId(page, 'holi-wizard-next-btn')
}

// Add a digital tool to a space (Linkhub)
const addDigitalTool = async (
  page: Page,
  url: string = 'https://www.holi.community',
  name: string = 'Team Chat',
  desc: string = 'A Place for our Community'
) => {
  await checkAccessibility(page)
  const toolUrlInput = await page.waitForSelector(byTestId('tool-url-input'))
  const toolTitleInput = await page.waitForSelector(byTestId('tool-title-input'))
  const toolDescriptionInput = await page.waitForSelector(byTestId('tool-description-input'))
  await toolUrlInput.fill(url)
  await toolTitleInput.fill(name)
  await toolDescriptionInput.fill(desc)
  await clickElementByTestId(page, 'digital-tool-collection-input')
  await clickElementByTestId(page, 'digital-tool-collection-item')
  await clickElementByTestId(page, `digital-tool-add-modal-save-btn`)
}
