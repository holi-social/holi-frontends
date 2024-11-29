import { faker } from '@faker-js/faker'
import { type Page, expect } from '@playwright/test'

import { byTestId, checkAccessibility, clickElementByTestId, waitForAnimationEnd, withSSR } from '../helpers'
import { test } from '../testmaster'

test.describe('@Profile', () => {
  test('user journey', async ({ browser, sessions }) => {
    // FIXME: https://holi.atlassian.net/browse/HOLI-9014
    // await loginAsE2EUser(context, page)
    // await clickElementByTestId(page, 'btn-to-profile-view')
    // fill the interests, skills and sdgs for visiting the profile later
    // await checkChipsSelection(page, 'interests')
    // await checkChipsSelection(page, 'skills')
    // await checkChipsSelection(page, 'sdgs')

    // now test with a generated user for not messing too much with the profile of the E2E user
    const { page: otherPage } = await sessions.signUp()
    await otherPage.goto('/profile')

    await testDisplaysProfileDetails(otherPage)

    //FIXME: AssertionError: 1 accessibility violation was detected in the following line
    await checkAccessibility(otherPage)
    await clickElementByTestId(otherPage, 'btn-open-profile-edit-view')
    // wait until modal is opened
    await otherPage.locator('[role="dialog"]').waitFor()
    await checkAccessibility(otherPage)

    // validation should block save
    await otherPage.locator(byTestId('first-name-input')).fill('a')
    await clickElementByTestId(otherPage, 'user-profile-edit-form-close-btn')
    await otherPage.locator(byTestId('first-name-input-error-message')).waitFor()
    await checkAccessibility(otherPage)

    // edit firstName should work
    const firstNameEdited = faker.person.firstName()
    const lastNameEdited = faker.person.lastName()
    await otherPage.locator(byTestId('first-name-input')).fill(firstNameEdited)
    await otherPage.locator(byTestId('last-name-input')).fill(lastNameEdited)
    await Promise.all([
      otherPage.waitForSelector(byTestId('user-profile-edit-form-loader'), { state: 'detached' }),
      clickElementByTestId(otherPage, 'user-profile-edit-form-close-btn'),
    ])

    await expect
      .poll(async () => await otherPage.textContent(byTestId('user-profile-full-name')))
      .toBe(`${firstNameEdited} ${lastNameEdited}`.trim())

    // visiting another user's profile should show the correct information
    const userId = process.env.E2E_USER_ID || 'empty'
    await otherPage.goto('/profile/' + userId)

    await testDisplaysProfileDetails(otherPage)
    await withSSR(browser, otherPage.url(), testDisplaysProfileDetails)
  })
})

const testDisplaysProfileDetails = async (page: Page) => {
  await page.waitForSelector(byTestId('user-profile-full-name'))
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
