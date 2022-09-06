import { Page, expect, test } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  defaultAuthSteps,
  delay,
  waitForAnimationEnd,
  waitForElementByTestId,
} from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('@Profile', () => {
  test('journey', async ({ context, page }) => {
    const userId = process.env.E2E_USER_ID || 'empty'

    // go to user profile page
    await page.goto('/profile/' + userId)
    await waitForElementByTestId(page, 'user-profile-full-name')
    await waitForElementByTestId(page, 'user-profile-interests')
    await waitForElementByTestId(page, 'user-profile-sdgs')
    await waitForElementByTestId(page, 'user-profile-skills')
    await checkAccessibility(page)

    // go to profile edit modal
    await defaultAuthSteps({ context, page })
    await page.waitForSelector(byTestId('btn-open-profile-edit-view'))
    await checkAccessibility(page)
    await delay(0.5) // source of flakyness and delay. Why do we need this here? Component is there, but click does not work when done too early.
    await page.locator(byTestId('btn-open-profile-edit-view')).click()
    await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))
    await checkAccessibility(page)

    // validation should block save
    await page.locator(byTestId('first-name-input')).fill('a')
    await page.locator(byTestId('user-profile-edit-form-close-btn')).click()
    await page.locator(byTestId('first-name-input-error-message')).waitFor()
    await checkAccessibility(page)

    // edit firstName should work
    const firstNameEdited = 'Text User Name'
    await page.locator(byTestId('first-name-input')).fill(firstNameEdited)
    const lastName = await page.inputValue(byTestId('last-name-input'))
    await page.locator(byTestId('user-profile-edit-form-close-btn')).click()
    await page.waitForSelector(byTestId('user-profile-edit-form-saving'), { state: 'detached' })
    expect(await page.textContent(byTestId('user-profile-full-name'))).toBe(`${firstNameEdited} ${lastName}`.trim())

    // edit interests, skills + sdgs should work
    await deselectAll(page, 'interests')
    await selectSomeItems(page, 'interests')
    await deselectAll(page, 'skills')
    await selectSomeItems(page, 'skills')
    await deselectAll(page, 'sdgs')
    await selectSomeItems(page, 'sdgs')

    // go to own profile after login
    await page.goto('/profile/' + userId)
    // expect redirect to own profile page
    await waitForElementByTestId(page, 'user-profile-full-name')
    expect(page.url()).not.toContain(userId)
    expect(page.url()).toContain('/profile')
  })
})

const selectSomeItems = async (page: Page, what: string) => {
  const userProfileTestId = byTestId(`user-profile-${what}`)

  await page.locator(byTestId(`user-profile-${what}-edit`)).click()
  await delay(0.5)
  await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))

  const noOfSelectableChips = await getCountOf(
    page,
    `${byTestId('user-profile-modal-animatedview')} >> [role=checkbox]`
  )
  // every third element, if there is one, one is selected; If there's 4, two are selected etc.
  const expectedNoOfSelectedChips: number = Math.floor((noOfSelectableChips - 1) / 3) + 1

  for (let indexToSelect = noOfSelectableChips - 1; indexToSelect > 0; indexToSelect = indexToSelect - 3) {
    await page
      .locator(`${byTestId('user-profile-modal-animatedview')} >> [role=checkbox]`)
      .nth(indexToSelect)
      .click()
  }

  const newSelectionCount = await getCountOf(
    page,
    `${byTestId('user-profile-modal-animatedview')} >> [aria-checked=true]`
  )
  expect(newSelectionCount).toBe(expectedNoOfSelectedChips)

  await saveAndClose(page)

  const presentedChips = await getCountOf(page, `${userProfileTestId} >> [role=presentation]`)
  expect(presentedChips).toBe(expectedNoOfSelectedChips)
}

const deselectAll = async (page: Page, what: string) => {
  const userProfileTestId = byTestId(`user-profile-${what}`)

  await page.locator(byTestId(`user-profile-${what}-edit`)).click()
  await delay(0.5)
  await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))

  const currentlySelected: number = await getCountOf(
    page,
    `${byTestId('user-profile-modal-animatedview')} >> [aria-checked=true]`
  )

  for (let stillSelected = currentlySelected; stillSelected > 0; stillSelected--) {
    await page
      .locator(`${byTestId('user-profile-modal-animatedview')} >> [aria-checked=true]`)
      .first()
      .click()
  }

  const stillSelected: number = await getCountOf(
    page,
    `${byTestId('user-profile-modal-animatedview')} >> [aria-checked=true]`
  )
  expect(stillSelected).toBe(0)

  await saveAndClose(page)

  const chipsCount = await getCountOf(page, `${userProfileTestId} >> [aria-checked=false]`)
  expect(chipsCount).toBe(1)

  const editButtonCount = await getCountOf(page, `${userProfileTestId} >> [role=checkbox]`)
  expect(editButtonCount).toBe(1)
}

const getCountOf = async (page: Page, selector: string) => {
  const locator = await page.locator(selector)
  return await locator.count()
}

const saveAndClose = async (page: Page) => {
  await page.locator(byTestId('user-profile-chipform-close-btn')).click()
  await page.waitForSelector(byTestId('user-profile-chipform-saving'), { state: 'detached' })
  await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))
  await delay(2)
}
