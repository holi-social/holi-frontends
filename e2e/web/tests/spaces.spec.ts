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
  await locationInput.fill('Berlin')

  // expect suggestions
  await clickElement(page.locator('[role="menuitem"]'))

  // open topics dropdown
  await clickElementByTestId(page, 'spaces-filter-interests-input')

  // click on first topic in the list
  await clickElementByTestId(page, 'spaces-filter-interests-item')

  // open skills dropdown
  await clickElementByTestId(page, 'spaces-filter-skills-input')

  // click on first skill in the list
  await clickElementByTestId(page, 'spaces-filter-skills-item')

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

  // create the space as a random user, so it gets cleaned up together with the user after the test, even if it fails
  await userHandler.asRandomUser(async (page) => {
    await clickElementByTestId(page, 'btn-to-spaces')
    await clickElementByTestId(page, 'btn-create-space')

    // create space - name and goal
    const initialName = 'e2e space name'
    const initialGoal = 'e2e space goal'
    await checkAccessibility(page)
    await checkConfirmButtonIsDisabled(page)
    await inputSpaceNameAndGoal(page, initialName, initialGoal)
    await clickElementByTestId(page, 'holi-wizard-next-btn')

    // create space - topics
    await checkAccessibility(page)
    await checkConfirmButtonIsDisabled(page)
    await selectSomeTerms(page, numberOfInitialTerms)
    await clickElementByTestId(page, 'holi-wizard-next-btn')

    // create space - cover image
    await checkAccessibility(page)
    await checkConfirmButtonIsDisabled(page)
    await page.setInputFiles('input[type="file"]', 'upload/cover_1.png')
    await clickElementByTestId(page, 'holi-wizard-next-btn')

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

    // // edit space name and goal
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

    // delete space
    await clickElementByTestId(page, 'space-edit-close')
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
