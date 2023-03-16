import { faker } from '@faker-js/faker'
import { Page, expect, test } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  defaultAuthSteps,
  delay,
  locateElementByTestId,
  waitForAnimationEnd,
  waitForElementByTestId,
  withRandomUserSession,
} from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.setTimeout(120000)

test.describe('@Profile', () => {
  test('user journey', async ({ browser, page, context }) => {
    // fill the interests, skills and sdgs for visiting the profile later
    await defaultAuthSteps({ page, context }, 'login')
    await waitForElementByTestId(page, 'btn-to-settings')

    await page.goto('/profile')
    await checkChipsSelection(page, 'interests')
    await checkChipsSelection(page, 'skills')
    await checkChipsSelection(page, 'sdgs')

    // now test with a generated user for not messing too much with the profile of the E2E user
    await (
      await withRandomUserSession(browser, async (page) => {
        await waitForElementByTestId(page, 'user-profile-full-name')

        await waitForElementByTestId(page, 'user-profile-interests')
        await waitForElementByTestId(page, 'user-profile-sdgs')
        await waitForElementByTestId(page, 'user-profile-skills')

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
        const firstNameEdited = faker.name.firstName()
        const lastNameEdited = faker.name.lastName()
        await page.locator(byTestId('first-name-input')).fill(firstNameEdited)
        await page.locator(byTestId('last-name-input')).fill(lastNameEdited)
        await delay(0.5)
        await clickElementByTestId(page, 'user-profile-edit-form-close-btn')
        await page.waitForSelector(byTestId('user-profile-edit-form-saving'), { state: 'detached' })

        await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))
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
    )()
  })
})

const checkChipsSelection = async (page: Page, what: string) => {
  await deselectAll(page, what)
  await selectSomeItemsAndVerify(page, what)
}

const deselectAll = async (page: Page, what: string) => {
  const userProfileTestId = byTestId(`user-profile-${what}`)

  // FIXME (in components) if the filter button is pressed too early (when no content is loaded),
  // it somehow completely breaks the filter button (does not work in any way)
  // FIXME delay is needed because of wrong implementation of component.
  await delay(2)
  await clickElementByTestId(page, `user-profile-${what}-edit`)
  await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))
  // first make sure the modal dialog is fully loaded
  const countOfChips = () => page.locator(`${byTestId('user-profile-modal-animatedview')} >> [role=checkbox]`).count()
  await expect.poll(countOfChips).toBeGreaterThan(0)

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
  const editButtonCount = () => getCountOf(page, `${userProfileTestId} >> [role=checkbox]`)
  await expect.poll(editButtonCount).toBe(1)

  // no chips should be shown
  const shownChips = () => getCountOf(page, `${userProfileTestId} >> [role=presentation]`)
  await expect.poll(shownChips).toBe(0)
}

const selectSomeItemsAndVerify = async (page: Page, what: string) => {
  const userProfileTestId = byTestId(`user-profile-${what}`)

  // FIXME (in components) if the filter button is pressed too early (when no content is loaded),
  // it somehow completely breaks the filter button (does not work in any way)
  // FIXME delay is needed because of wrong implementation of component.
  await delay(2)
  await clickElementByTestId(page, `user-profile-${what}-edit`)
  await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))
  // first make sure the modal dialog is fully loaded
  const countOfChips = () => page.locator(`${byTestId('user-profile-modal-animatedview')} >> [role=checkbox]`).count()
  await expect.poll(countOfChips).toBeGreaterThan(0)

  const expectedNoOfSelectedChips = 3

  for (let indexToSelect = 0; indexToSelect < expectedNoOfSelectedChips; indexToSelect++) {
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
  const shownChips = () => getCountOf(page, `${userProfileTestId} >> [role=presentation]`)
  await expect.poll(shownChips).toBe(expectedNoOfSelectedChips)
}

const getCountOf = async (page: Page, selector: string) => {
  const locator = await page.locator(selector)
  return await locator.count()
}

const saveAndCloseChipform = async (page: Page) => {
  await clickElementByTestId(page, 'user-profile-chipform-close-btn')
  await page.waitForSelector(byTestId('user-profile-chipform-saving'), { state: 'detached' })
  await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))
  await page.waitForSelector(byTestId('user-profile-modal-animatedview'), { state: 'detached' })
  await waitForElementByTestId(page, 'user-profile-full-name')
}
