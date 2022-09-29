import { Page, expect, test } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
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
    await checkAccessibility(page)
    await clickElementByTestId(page, 'btn-open-profile-edit-view')
    await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))
    await checkAccessibility(page)

    // validation should block save
    await page.locator(byTestId('first-name-input')).fill('a')
    await clickElementByTestId(page, 'user-profile-edit-form-close-btn')
    await page.locator(byTestId('first-name-input-error-message')).waitFor()
    await checkAccessibility(page)

    // edit firstName should work
    const firstNameEdited = 'Proper First Name'
    await page.locator(byTestId('first-name-input')).fill(firstNameEdited)
    const lastName = await page.inputValue(byTestId('last-name-input'))
    await delay(0.5)
    await clickElementByTestId(page, 'user-profile-edit-form-close-btn')
    await page.waitForSelector(byTestId('user-profile-edit-form-saving'), { state: 'detached' })

    await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))
    await delay(0.5)
    const editedFullName = await page.textContent(byTestId('user-profile-full-name'))
    expect(editedFullName).toBe(`${firstNameEdited} ${lastName}`.trim())

    // edit interests, skills + sdgs should work
    await delay(2)
    await checkChipsSelection(page, 'interests')
    await checkChipsSelection(page, 'skills')
    await checkChipsSelection(page, 'sdgs')

    // go to own profile after login
    await page.goto('/profile/' + userId)
    // expect redirect to own profile page
    await waitForElementByTestId(page, 'user-profile-full-name')
    expect(page.url()).not.toContain(userId)
    expect(page.url()).toContain('/profile')
  })
})

const checkChipsSelection = async (page: Page, what: string) => {
  await deselectAll(page, what)
  await selectSomeItemsAndVerify(page, what)
}

const deselectAll = async (page: Page, what: string) => {
  const userProfileTestId = byTestId(`user-profile-${what}`)

  await clickElementByTestId(page, `user-profile-${what}-edit`)
  await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))

  const countOfSelectedChips: number = await getCountOf(
    page,
    `${byTestId('user-profile-modal-animatedview')} >> [aria-checked=true]`
  )

  for (let stillSelectedCount = countOfSelectedChips; stillSelectedCount > 0; stillSelectedCount--) {
    await page
      .locator(`${byTestId('user-profile-modal-animatedview')} >> [aria-checked=true]`)
      .first()
      .click()
  }

  const stillSelectedCount: number = await getCountOf(
    page,
    `${byTestId('user-profile-modal-animatedview')} >> [aria-checked=true]`
  )
  expect(stillSelectedCount).toBe(0)

  await saveAndCloseChipform(page)

  // only edit button is visible
  const editButtonCount = await getCountOf(page, `${userProfileTestId} >> [role=checkbox]`)
  expect(editButtonCount).toBe(1)

  // no chips should be shown
  const shownChips = await getCountOf(page, `${userProfileTestId} >> [role=presentation]`)
  expect(shownChips).toBe(0)
}

const selectSomeItemsAndVerify = async (page: Page, what: string) => {
  const userProfileTestId = byTestId(`user-profile-${what}`)

  await clickElementByTestId(page, `user-profile-${what}-edit`)
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

  await saveAndCloseChipform(page)

  // all selected chips should be shown
  const shownChips = await getCountOf(page, `${userProfileTestId} >> [role=presentation]`)
  expect(shownChips).toBe(expectedNoOfSelectedChips)
}

const getCountOf = async (page: Page, selector: string) => {
  const locator = await page.locator(selector)
  return await locator.count()
}

const saveAndCloseChipform = async (page: Page) => {
  await clickElementByTestId(page, 'user-profile-chipform-close-btn')
  await page.waitForSelector(byTestId('user-profile-chipform-saving'), { state: 'detached' })
  await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))
  await delay(2)
}
