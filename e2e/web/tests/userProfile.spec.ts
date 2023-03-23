import { faker } from '@faker-js/faker'
import { Page, expect } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  loginAsE2EUser,
  waitForElementByTestId,
  waitForElementByTestIdToBeDetached,
} from './helpers'
import { test } from './testmaster'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.setTimeout(120000)

test.describe('@Profile', () => {
  test('user journey', async ({ page, context, userHandler }) => {
    await loginAsE2EUser(context, page)

    // fill the interests, skills and sdgs for visiting the profile later
    await page.goto('/profile')
    await checkChipsSelection(page, 'interests')
    await checkChipsSelection(page, 'skills')
    await checkChipsSelection(page, 'sdgs')

    // now test with a generated user for not messing too much with the profile of the E2E user
    await userHandler.asRandomUser(async (page) => {
      await waitForElementByTestId(page, 'user-profile-full-name')

      await waitForElementByTestId(page, 'user-profile-interests')
      await waitForElementByTestId(page, 'user-profile-sdgs')
      await waitForElementByTestId(page, 'user-profile-skills')

      await checkAccessibility(page)
      await clickElementByTestId(page, 'btn-open-profile-edit-view')
      await checkAccessibility(page)

      // validation should block save
      await page.locator(byTestId('first-name-input')).fill('a')
      await clickElementByTestId(page, 'user-profile-edit-form-close-btn')
      await page.locator(byTestId('first-name-input-error-message')).waitFor()
      await checkAccessibility(page)

      // edit firstName should work
      const firstNameEdited = faker.name.firstName()
      const lastNameEdited = faker.name.lastName()
      await page.locator(byTestId('first-name-input')).fill(firstNameEdited)
      await page.locator(byTestId('last-name-input')).fill(lastNameEdited)
      await Promise.all([
        waitForElementByTestIdToBeDetached(page, 'user-profile-edit-form-saving'),
        clickElementByTestId(page, 'user-profile-edit-form-close-btn'),
      ])

      await expect
        .poll(async () => await page.textContent(byTestId('user-profile-full-name')))
        .toBe(`${firstNameEdited} ${lastNameEdited}`.trim())

      // visiting another user's profile should show the correct information
      const userId = process.env.E2E_USER_ID || 'empty'
      await page.goto('/profile/' + userId)
      await waitForElementByTestId(page, 'user-profile-full-name')
      await waitForElementByTestId(page, 'user-profile-interests')
      await waitForElementByTestId(page, 'user-profile-sdgs')
      await waitForElementByTestId(page, 'user-profile-skills')

      await checkAccessibility(page)
    })
  })
})

const checkChipsSelection = async (page: Page, what: string) => {
  await deselectAll(page, what)
  await selectSomeItemsAndVerify(page, what)
}

const deselectAll = async (page: Page, what: string) => {
  const userProfileTestId = byTestId(`user-profile-${what}`)

  await clickElementByTestId(page, `user-profile-${what}-edit`)
  // first make sure the modal dialog is fully loaded
  const countOfChips = () => page.locator(`${byTestId('user-profile-modal-animatedview')} >> [role=checkbox]`).count()
  await expect.poll(countOfChips).toBeGreaterThan(0)

  const selectorForSelectedChips = `${byTestId('user-profile-modal-animatedview')} >> [aria-checked=true]`
  const countOfSelectedChips = async (): Promise<number> => getCountOf(page, selectorForSelectedChips)

  for (let stillSelectedCount = await countOfSelectedChips(); stillSelectedCount > 0; stillSelectedCount--) {
    await page.locator(selectorForSelectedChips).first().click()
    await expect.poll(countOfSelectedChips).toBe(stillSelectedCount - 1)
  }

  expect(await countOfSelectedChips()).toBe(0)

  await saveAndCloseChipform(page)

  // only edit button is visible
  const editButtonCount = () => getCountOf(page, `${userProfileTestId} >> [role=checkbox]`)
  await expect.poll(editButtonCount).toBe(1)

  // no chips should be shown
  const shownChips = () => getCountOf(page, `${userProfileTestId} >> [role=presentation]`)
  await expect.poll(shownChips).toBe(0)
}

const selectSomeItemsAndVerify = async (page: Page, what: string) => {
  const userProfileTestId = byTestId(`user-profile-${what}`)

  await clickElementByTestId(page, `user-profile-${what}-edit`)
  // first make sure the modal dialog is fully loaded
  const countOfChips = () => page.locator(`${byTestId('user-profile-modal-animatedview')} >> [role=checkbox]`).count()
  await expect.poll(countOfChips).toBeGreaterThan(0)
  const countOfSelectedChips = async (): Promise<number> =>
    getCountOf(page, `${byTestId('user-profile-modal-animatedview')} >> [aria-checked=true]`)

  const expectedNoOfSelectedChips = 3

  for (let indexToSelect = 0; indexToSelect < expectedNoOfSelectedChips; indexToSelect++) {
    await page
      .locator(`${byTestId('user-profile-modal-animatedview')} >> [role=checkbox]`)
      .nth(indexToSelect)
      .click()
    await expect.poll(countOfSelectedChips).toBe(indexToSelect + 1)
  }

  await expect.poll(countOfSelectedChips).toBe(expectedNoOfSelectedChips)

  await saveAndCloseChipform(page)

  // all selected chips should be shown
  const shownChips = () => getCountOf(page, `${userProfileTestId} >> [role=presentation]`)
  await expect.poll(shownChips).toBe(expectedNoOfSelectedChips)
}

const getCountOf = async (page: Page, selector: string): Promise<number> => {
  return page.locator(selector).count()
}

const saveAndCloseChipform = async (page: Page) => {
  await Promise.all([
    clickElementByTestId(page, 'user-profile-chipform-close-btn'),
    waitForElementByTestIdToBeDetached(page, 'user-profile-chipform-saving'),
    waitForElementByTestIdToBeDetached(page, 'user-profile-modal-animatedview'),
  ])
  await waitForElementByTestId(page, 'user-profile-full-name')
}
