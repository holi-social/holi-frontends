import { faker } from '@faker-js/faker'
import { type Page, expect } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByAriaLabel,
  clickElementByTestId,
  waitForAnimationEnd,
  withSSR,
} from '../helpers'
import { test } from '../testmaster'

test.describe('@Profile', () => {
  test('user journey', async ({ browser, sessions }) => {
    const { page: user } = await sessions.signUp()

    await test.step('profile home looks good', async () => {
      await clickElementByTestId(user, 'btn-to-profile-view')
      await testDisplaysProfileDetails(user)
      await checkAccessibility(user)
    })

    await test.step('shows validation error when change name to a single letter', async () => {
      await user.goto('/profile/settings/aboutMe')
      await checkAccessibility(user)

      await clickElementByAriaLabel(user, 'Edit')
      await user.locator(byTestId('first-name-input')).fill('a')
      await clickElementByTestId(user, 'user-profile-edit-form-close-btn')
      await user.locator(byTestId('first-name-input-error-message')).waitFor()
    })

    await test.step('can change first name to a proper name', async () => {
      const firstNameEdited = faker.person.firstName()
      const lastNameEdited = faker.person.lastName()
      await user.locator(byTestId('first-name-input')).fill(firstNameEdited)
      await user.locator(byTestId('last-name-input')).fill(lastNameEdited)
      await Promise.all([
        user.waitForSelector(byTestId('user-profile-edit-form-loader'), { state: 'detached' }),
        clickElementByTestId(user, 'user-profile-edit-form-close-btn'),
      ])

      await expect(user.getByText(`${firstNameEdited} ${lastNameEdited}`)).toBeVisible()
    })

    await test.step('another users profile show the correct information', async () => {
      const userId = process.env.E2E_USER_ID || 'empty'
      await user.goto('/profile/' + userId)

      await testDisplaysProfileDetails(user)
      await withSSR(browser, user.url(), testDisplaysProfileDetails)
    })
  })
})

const testDisplaysProfileDetails = async (page: Page) => {
  await page.waitForSelector(byTestId('user-profile-full-name'))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkChipsSelection = async (page: Page, what: string) => {
  await deselectAll(page, what)
  await selectSomeItemsAndVerify(page, what)
}

const deselectAll = async (page: Page, what: string) => {
  const userProfileTestId = byTestId(`user-profile-${what}`)

  await clickElementByTestId(page, `user-profile-${what}-edit`)
  await waitForAnimationEnd(page, byTestId('user-profile-modal-animatedview'))
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
  await waitForAnimationEnd(page, byTestId('user-profile-modal-animatedview'))
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
    page.waitForSelector(byTestId('user-profile-edit-form-loader'), { state: 'detached' }),
    page.waitForSelector(byTestId('user-profile-modal-animatedview'), { state: 'detached' }),
  ])
  await page.waitForSelector(byTestId('user-profile-full-name'))
}
