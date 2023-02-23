import { Page, expect, test } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  defaultAuthSteps,
  delay,
  locateElementByTestId,
  waitForElementByTestId,
} from './helpers'

test.beforeEach(async ({ page }) => {
  await page.goto('/spaces')
  await expect.poll(() => page.url()).toContain('/spaces')
})

test.describe('@Spaces', () => {
  test('should be accessible from home screen', async ({ page }) => {
    await page.goto('/')
    await clickElementByTestId(page, 'btn-to-spaces')

    await waitForElementByTestId(page, 'spaces-container')
    expect(page.url()).toContain('/spaces')
  })

  test('should display multiple groups with spaces', async ({ page }) => {
    const countGroups = async () => await (await locateElementByTestId(page, 'spaces-group-slider')).count()
    const countSpaces = async () => await (await locateElementByTestId(page, 'space-link')).count()

    await waitForElementByTestId(page, 'spaces-container')

    await expect.poll(countGroups, { timeout: 10000 }).toBeGreaterThan(0)
    await expect.poll(countSpaces, { timeout: 10000 }).toBeGreaterThan(0)

    await checkAccessibility(page)
  })

  test('should open the spaces filter menu and filter spaces with multiple filters', async ({ page }) => {
    await clickElementByTestId(page, 'btn-filter-spaces')

    const locationInput = await locateElementByTestId(page, 'spaces-filter-location-input')
    await locationInput.fill('Berlin')

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
      await clickElementByTestId(page, 'holi-modal-content-close-btn'),
      page.waitForNavigation({ url: '**/spaces/**' }),
    ])

    // check if the filtered spaces container is shown
    await waitForElementByTestId(page, 'filtered-spaces-container')
  })

  test('should display space details', async ({ page }) => {
    await waitForElementByTestId(page, 'spaces-container')
    // click first element on page
    await clickElementByTestId(page, 'space-link')

    await waitForElementByTestId(page, 'space-details-container')

    await waitForElementByTestId(page, 'space-header')

    await waitForElementByTestId(page, 'space-avatar')

    await waitForElementByTestId(page, 'space-title')

    await waitForElementByTestId(page, 'space-description')

    // check if collaborators are displayed
    await clickElementByTestId(page, 'space-members')

    // check if on click the user profile is displayed
    await waitForElementByTestId(page, 'spaces-collaborators-item')

    await clickElementByTestId(page, 'btn-to-close-space-collaborators-modal')

    await checkAccessibility(page)

    const spaceUrlPrefix = '/spaces/'
    expect(page.url()).toContain(spaceUrlPrefix)
  })

  test('should be able to create, edit and delete a space', async ({ page, context }) => {
    const numberOfInitialTerms = 3
    const numberOfEditedTerms = 2

    await page.goto('/')
    await defaultAuthSteps({ page, context })
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

    // // edit space name and goal
    const editedName = 'e2e edited space name HELLO THERE'
    const editedGoal = 'e2e edited space goal'
    await clickElementByTestId(page, 'btn-space-edit-name')
    await inputSpaceNameAndGoal(page, editedName, editedGoal)
    await clickElementByTestId(page, 'space-edit-modal-save-btn')

    // check if space name and goal were updated
    editSpaceTitle = await locateElementByTestId(page, 'space-edit-title')
    editSpaceGoal = await locateElementByTestId(page, 'space-edit-goal')
    expect(editSpaceTitle).toContainText(editedName)
    expect(editSpaceGoal).toContainText(editedGoal)

    // edit space avatar
    await clickElementByTestId(page, 'btn-space-edit-avatar')
    await page.setInputFiles('input[type="file"]', 'upload/avatar.png')
    await clickElementByTestId(page, 'space-edit-modal-save-btn')

    // edit space cover image
    await clickElementByTestId(page, 'btn-space-edit-cover')
    await page.setInputFiles('input[type="file"]', 'upload/cover_2.png')
    await clickElementByTestId(page, 'space-edit-modal-save-btn')

    // edit space topics
    await clickElementByTestId(page, 'btn-space-edit-topics')
    await selectSomeTerms(page, numberOfEditedTerms)
    await clickElementByTestId(page, 'space-edit-modal-save-btn')

    // check if the correct number of topics have been selected
    await delay(1)
    const numberOfEditedTopics = await page.locator(byTestId('space-edit-topics-chip')).count()
    expect(numberOfEditedTopics).toBe(numberOfEditedTerms)

    // edit space sdgs
    await clickElementByTestId(page, 'btn-space-edit-sdgs')
    await selectSomeTerms(page, numberOfEditedTerms)
    await clickElementByTestId(page, 'space-edit-modal-save-btn')

    // check if the correct number of sdgs have been selected
    await delay(1)
    const numberOfEditedSdgs = await page.locator(byTestId('space-edit-sdgs-chip')).count()
    expect(numberOfEditedSdgs).toBe(numberOfEditedTerms)

    // delete space
    await clickElementByTestId(page, 'space-edit-close')
    await clickElementByTestId(page, 'space-options-btn')
    await clickElementByTestId(page, 'space-delete-btn')
    await clickElementByTestId(page, 'space-delete-confirmation-confirm')

    // check if after deletion we are at the spaces dashboard (mine/discover)
    await waitForElementByTestId(page, 'spaces-tab-navigation')
  })
})

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
  const locator = page.locator(`${byTestId('space-terms-list')} >> [role="checkbox"]`)
  const numberOfTotalTerms = await locator.count()
  const numberOfSelectedTerms = await page
    .locator(`${byTestId('space-terms-list')} >> [role="checkbox"][aria-checked="true"]`)
    .count()

  // unselect all
  for (let i = 0; i < numberOfSelectedTerms; i++) {
    // the selected terms are always sorted as first, thus nth(0)
    await locator.nth(0).click()
  }

  // select new terms
  for (let i = 0; i < numberOfTermsToSelect; i++) {
    // the selected terms are always sorted as first, so we select the last ones to avoid unselection
    await locator.nth(numberOfTotalTerms - 1).click()
  }
}
