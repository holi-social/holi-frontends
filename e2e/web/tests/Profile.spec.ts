import { Page, expect, test } from '@playwright/test'

import { byTestId, delay } from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

type DefaultLoginStepsProps = {
  page: Page
  username?: string
  password?: string
}

export const defaultLoginSteps = async ({ page, username, password }: DefaultLoginStepsProps) => {
  await page.waitForSelector(byTestId('btn-to-profile-view'))
  await page.locator(byTestId('btn-to-profile-view')).click()
  await page.waitForSelector(byTestId('btn-to-login-form'))
  await page.locator(byTestId('btn-to-login-form')).click()
  await page.waitForSelector(byTestId('ory-submit-method'))
  await page.locator(byTestId('ory-input-identifier-input')).fill(username || process.env.E2E_USER_USERNAME || 'empty')
  await page.locator(byTestId('ory-input-password-input')).fill(password || process.env.E2E_USER_PASSWORD || 'empty')
  await page.locator(byTestId('ory-submit-method')).click()
}

const profileEditModalSteps = async (page: Page) => {
  await delay(1)
  await page.waitForSelector(byTestId('btn-open-profile-edit-view'))
  await delay(1)
  await page.locator(byTestId('btn-open-profile-edit-view')).click()
  await delay(1)
  await page.waitForSelector(byTestId('user-profile-edit-form'))
}

test.describe('@Profile', () => {
  test('edit should work', async ({ page }) => {
    await defaultLoginSteps({ page })
    await profileEditModalSteps(page)
    const firstName = await page.inputValue(byTestId('first-name-input'))
    const editedIndex = firstName.indexOf('~%')
    const firstNameEdited = `${editedIndex >= 0 ? firstName.substring(0, editedIndex) : firstName}~%${Date.now()}`
    await page.locator(byTestId('first-name-input')).fill(`${firstNameEdited}`)
    const lastName = await page.inputValue(byTestId('last-name-input'))
    await page.locator(byTestId('btn-user-profile-edit-form-save')).click()
    await page.waitForSelector(byTestId('user-profile-full-name'))
    await page.locator(byTestId('user-profile-edit-saved')).waitFor()
    expect(await page.textContent(byTestId('user-profile-full-name'))).toBe(`${firstNameEdited} ${lastName}`.trim())
  })

  test('validation should block save', async ({ page }) => {
    await defaultLoginSteps({ page })
    await profileEditModalSteps(page)
    const firstName = (await page.inputValue(byTestId('first-name-input'))).substring(0, 1)
    await page.locator(byTestId('first-name-input')).fill(`${firstName}`)
    await page.locator(byTestId('btn-user-profile-edit-form-save')).click()
    await page.locator(byTestId('first-name-input-error-message')).waitFor()
  })
})
