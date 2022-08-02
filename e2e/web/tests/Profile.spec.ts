import { expect, test } from '@playwright/test'
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
    //await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))
    expect(await page.textContent(byTestId('user-profile-full-name'))).toBe(`${firstNameEdited} ${lastName}`.trim())

    // deselecting all interests should work
    await page.locator(byTestId('user-profile-interests-edit')).click()
    await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))
    await checkAccessibility(page)
    const noSelected: number = await page
      .locator(`${byTestId('user-profile-modal-animatedview')} >> [aria-checked=true]`)
      .count()
    var stillSelected: number
    for (stillSelected = noSelected, stillSelected > 0; stillSelected--; ) {
      await page
        .locator(`${byTestId('user-profile-modal-animatedview')} >> [aria-checked=true]`)
        .first()
        .click()
    }
    expect(await page.locator(`${byTestId('user-profile-modal-animatedview')} >> [aria-checked=true]`).count()).toBe(0)
    await page.locator(byTestId('user-profile-chipform-interests-save')).click()
    await page.waitForSelector(byTestId('user-profile-chipform-interests-saving'), { state: 'detached' })
    await checkAccessibility(page)

    // there should be no interest selected
    expect(await page.locator(`${byTestId('user-profile-interests')} >> [role="checkbox"]`).count()).toBe(1)

    // selecting some interests should work
    await page.locator(`${byTestId('user-profile-interests')} >> [role="checkbox"]`).click()
    await waitForAnimationEnd(page.locator(byTestId('user-profile-modal-animatedview')))
    const noAvailable: number = await page
      .locator(`${byTestId('user-profile-modal-animatedview')} >> [role="checkbox"]`)
      .count()
    var toSelect: number
    var selected: number = 0
    for (toSelect = noAvailable - 1; toSelect > 0; toSelect = toSelect - 3) {
      await page
        .locator(`${byTestId('user-profile-modal-animatedview')} >> [role="checkbox"]`)
        .nth(toSelect)
        .click()
      selected++
    }
    await page.locator(byTestId('user-profile-chipform-interests-save')).click()
    await page.waitForSelector(byTestId('user-profile-chipform-interests-saving'), { state: 'detached' })
    await checkAccessibility(page)

    // the selected interests should be visible on the profile page
    expect(await page.locator(`${byTestId('user-profile-interests')} >> [role="presentation"]`).count()).toBe(selected)
  })
})
