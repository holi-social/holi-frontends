import { Page, expect, test } from '@playwright/test'
import { injectAxe } from 'axe-playwright'

import { byTestId, checkAccessibility, defaultAuthSteps, delay, waitForAnimationEnd } from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await injectAxe(page)
})

test.describe('@Profile', () => {
  test('journey', async ({ context, page }) => {
    await defaultAuthSteps({ context, page })
    await page.waitForSelector(byTestId('btn-open-profile-edit-view'))
    await checkAccessibility(page)
    await delay(0.5) // source of flakyness and delay. Why do we need this here? Component is there, but click does not work when done too early.
    await page.locator(byTestId('btn-open-profile-edit-view')).click()
    await waitForAnimationEnd(page.locator(byTestId('user-profile-modal')))
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

    await deselectAll(page, 'interests')
    await selectTwoChips(page, 'interests')

    await deselectAll(page, 'skills')
    await selectTwoChips(page, 'skills')

    await deselectAll(page, 'sdgs')
    await selectTwoChips(page, 'sdgs')
  })
})

const selectTwoChips = async (page: Page, what: string) => {
  const userProfileTestId = byTestId(`user-profile-${what}`)

  await page.locator(byTestId(`user-profile-${what}-edit`)).click()
  await delay(0.5)
  await waitForAnimationEnd(page.locator(byTestId('user-profile-modal')))

  const noOfSelectableChips: number = await page.locator(`${byTestId('user-profile-modal')} >> [role=checkbox]`).count()
  const noExpected: number = Math.floor((noOfSelectableChips - 1) / 3) + 1 // every third element, if there is one, one is selected; If there's 4, two are selected etc.

  for (let toSelect = noOfSelectableChips - 1; toSelect > 0; toSelect = toSelect - 3) {
    await page
      .locator(`${byTestId('user-profile-modal')} >> [role=checkbox]`)
      .nth(toSelect)
      .click()
  }

  const nowSelected = await getCountOf(page, `${byTestId('user-profile-modal')} >> [aria-checked=true]`)
  expect(nowSelected).toBe(noExpected)

  await saveAndClose(page)

  const presentedChips = await getCountOf(page, `${userProfileTestId} >> [role=presentation]`)
  expect(presentedChips).toBe(noExpected)
}

const deselectAll = async (page: Page, what: string) => {
  const userProfileTestId = byTestId(`user-profile-${what}`)

  await page.locator(byTestId(`user-profile-${what}-edit`)).click()
  await delay(0.5)
  await waitForAnimationEnd(page.locator(byTestId('user-profile-modal')))

  const currentlySelected: number = await getCountOf(page, `${byTestId('user-profile-modal')} >> [aria-checked=true]`)

  for (let stillSelected = currentlySelected; stillSelected > 0; stillSelected--) {
    await page
      .locator(`${byTestId('user-profile-modal')} >> [aria-checked=true]`)
      .first()
      .click()
  }

  const stillSelected: number = await getCountOf(page, `${byTestId('user-profile-modal')} >> [aria-checked=true]`)
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
  await waitForAnimationEnd(page.locator(byTestId('user-profile-modal')))
  await delay(2)
}
