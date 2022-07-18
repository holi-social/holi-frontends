import { test } from '@playwright/test'

import { selectorByTestId } from './helpers'

test.beforeEach(async ({ page }) => {
  // console.log(process.env)
  // console.log(process.env.E2E_USER_USERNAME)
  // console.log(process.env.E2E_USER_PASSWORD)
  await page.goto('/')
})

test.describe('Login', () => {
  test('should work with valid credentials', async ({ page }) => {
    await page.locator(selectorByTestId('profile-button')).waitFor()
    await page.locator(selectorByTestId('profile-button')).click()
    await page.waitForSelector(selectorByTestId('login-button'))
    await page.locator(selectorByTestId('login-button')).click()
    await page.waitForSelector(selectorByTestId('ory-submit-method'))
    await page.locator(selectorByTestId('ory-input-identifier-input')).fill('')
    await page.locator(selectorByTestId('ory-input-password-input')).fill('')
    await page.locator(selectorByTestId('ory-submit-method')).click()
    await page.click(selectorByTestId('ory-submit-method'))
    await page.locator(selectorByTestId('edit-button')).waitFor()
  })

  // test('should not work with invalid credentials', async ({ page }) => {
  //   await page.locator(selectorByTestId('profile-button')).waitFor()
  //   await page.locator(selectorByTestId('profile-button')).click()
  //   await page.waitForSelector(selectorByTestId('login-button'))
  //   await page.locator(selectorByTestId('login-button')).click()
  //   await page.waitForSelector(selectorByTestId('ory-input-identifier-input'))
  //   await page.locator(selectorByTestId('ory-input-identifier-input')).fill('asfd@asdf.de')
  //   await page.locator(selectorByTestId('ory-input-password-input')).fill('1234')
  //   await page.locator(selectorByTestId('ory-submit-method')).click()
  //   // see https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-error-codes
  //   // for more ory error codes
  //   await page.locator(selectorByTestId('ory-message-4000006')).waitFor()
  // })
})
