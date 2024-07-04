import { faker } from '@faker-js/faker'
import { Page, expect } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  loginAsE2EUser,
  waitForAnimationEnd,
  withSSR,
} from './helpers'
import { test } from './testmaster'

test.setTimeout(120000)

test.describe('@Profile', () => {
  test('user journey', async ({ browser, page, context, userHandler, browserName }) => {
    await loginAsE2EUser(context, page)

    // fill the interests, skills and sdgs for visiting the profile later
    await checkChipsSelection(page, 'interests')
    await checkChipsSelection(page, 'skills')
    await checkChipsSelection(page, 'sdgs')

    // now test with a generated user for not messing too much with the profile of the E2E user
    await userHandler.asRandomUser(async (page) => {
      await testDisplaysProfileDetails(page)

      await checkAccessibility(page)
      await clickElementByTestId(page, 'btn-open-profile-edit-view')
      // wait until modal is opened
      await page.locator('[role="dialog"]').waitFor()
      await checkAccessibility(page)

      // validation should block save
      await page.locator(byTestId('first-name-input')).fill('a')
      await clickElementByTestId(page, 'user-profile-edit-form-close-btn')
      await page.locator(byTestId('first-name-input-error-message')).waitFor()
      await checkAccessibility(page)

      // edit firstName should work
      const firstNameEdited = faker.person.firstName()
      const lastNameEdited = faker.person.lastName()
      await page.locator(byTestId('first-name-input')).fill(firstNameEdited)
      await page.locator(byTestId('last-name-input')).fill(lastNameEdited)
      await Promise.all([
        page.waitForSelector(byTestId('user-profile-edit-form-loader'), { state: 'detached' }),
        clickElementByTestId(page, 'user-profile-edit-form-close-btn'),
      ])

      await expect
        .poll(async () => await page.textContent(byTestId('user-profile-full-name')))
        .toBe(`${firstNameEdited} ${lastNameEdited}`.trim())

      // FIXME: After Expo upgrade to 49 Mobile_WebKit has a bug `Error: page.goto: Navigation to "http://localhost:3000/profile/5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0" is interrupted by another navigation to "http://localhost:3000/profile"`
      if (browserName === 'webkit') return

      // visiting another user's profile should show the correct information
      const userId = process.env.E2E_USER_ID || 'empty'
      await page.goto('/profile/' + userId)

      await testDisplaysProfileDetails(page)
      await withSSR(browser, page.url(), testDisplaysProfileDetails)

      // FIXME: Currently the a11y rule "scrollable-region-focusable" is violated by the HoliStepper, see https://holi.atlassian.net/browse/HOLI-4295
      // await checkAccessibility(page)
    })
  })
})

const testDisplaysProfileDetails = async (page: Page) => {
  await page.waitForSelector(byTestId('user-profile-full-name'))
  await page.waitForSelector(byTestId('user-profile-interests'))
  await page.waitForSelector(byTestId('user-profile-sdgs'))
  await page.waitForSelector(byTestId('user-profile-skills'))
}

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
