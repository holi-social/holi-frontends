import { Page, expect, test } from '@playwright/test'
import { injectAxe } from 'axe-playwright'

import { byTestId, checkAccessibility, defaultLoginSteps, delay, waitForAnimationEnd } from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await injectAxe(page)
})

test.describe('@Profile', () => {
  test('journey', async ({ page }) => {
    // go to profile edit modal
    await defaultLoginSteps({ page })
    await page.waitForSelector(byTestId('btn-open-profile-edit-view'))
    await checkAccessibility(page)
    await delay(0.5) // source of flakyness and delay. Why do we need this here? Component is there, but click does not work when done too early.
    await page.locator(byTestId('btn-open-profile-edit-view')).click()
    await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))
    await checkAccessibility(page)

    // validation should block save
    await page.locator(byTestId('first-name-input')).fill('a')
    await page.locator(byTestId('btn-user-profile-edit-form-save')).click()
    await page.locator(byTestId('first-name-input-error-message')).waitFor()
    await checkAccessibility(page)

    // edit firstName should work
    const firstNameEdited = `e2etest ${Date.now()}`
    await page.locator(byTestId('first-name-input')).fill(firstNameEdited)
    const lastName = await page.inputValue(byTestId('last-name-input'))
    await page.locator(byTestId('btn-user-profile-edit-form-save')).click()
    await page.waitForSelector(byTestId('user-profile-edit-form-saving'), { state: 'detached' })
    expect(await page.textContent(byTestId('user-profile-full-name'))).toBe(`${firstNameEdited} ${lastName}`.trim())

    await checkChipRow(page, 'interests')
    await checkChipRow(page, 'skills')
  })
})

const checkChipRow = async (page: Page, what: string) => {
  const userProfileTestId = byTestId(`user-profile-${what}`)

  // deselecting all chips should work
  await page.locator(byTestId(`user-profile-${what}-edit`)).click()
  await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))
  await checkAccessibility(page)
  const noSelected: number = await page
    .locator(`${byTestId('user-profile-modal-animatedview')} >> [aria-checked=true]`)
    .count()
  for (let stillSelected = noSelected; stillSelected > 0; stillSelected--) {
    await page
      .locator(`${byTestId('user-profile-modal-animatedview')} >> [aria-checked=true]`)
      .first()
      .click()
  }
  expect(await page.locator(`${byTestId('user-profile-modal-animatedview')} >> [aria-checked=true]`).count()).toBe(0)
  await save(page, what)
  await checkAccessibility(page)

  // there should be no chip selected, the only chip available should be the one opening the modal layer
  expect(await page.locator(`${userProfileTestId} >> [role="checkbox"]`).count()).toBe(1)

  await page.locator(`${userProfileTestId} >> [role="checkbox"]`).click()
  await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))
  const noAvailable: number = await page
    .locator(`${byTestId('user-profile-modal-animatedview')} >> [role="checkbox"]`)
    .count()
  const noExpected: number = Math.floor((noAvailable - 1) / 3) + 1 // every third element, if there is one, one is selected; If there's 4, two are selected etc.
  for (let toSelect = noAvailable - 1; toSelect > 0; toSelect = toSelect - 3) {
    await page
      .locator(`${byTestId('user-profile-modal-animatedview')} >> [role="checkbox"]`)
      .nth(toSelect)
      .click()
  }
  await save(page, what)
  await checkAccessibility(page)

  // the selected chips should be visible on the profile page
  expect(await page.locator(`${userProfileTestId} >> [role="presentation"]`).count()).toBe(noExpected)
}

const save = async (page: Page, what: string) => {
  await page.locator(byTestId(`user-profile-chipform-${what}-save`)).click()
  await page.waitForSelector(byTestId(`user-profile-chipform-${what}-saving`), { state: 'detached' })
}
