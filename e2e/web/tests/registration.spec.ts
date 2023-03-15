import { Browser, BrowserContext, Page, test } from '@playwright/test'

import {
  checkAccessibility,
  clickElementByTestId,
  defaultAuthSteps,
  waitForElementByTestId,
  withRandomUserSession,
} from './helpers'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await clickElementByTestId(page, 'btn-to-continue-as-guest')
})

test.describe('@Registration', () => {
  test('user journey', async ({ browser, context, page }) => {
    await redirectsFromRegistrationToLoginAndBackToRegistration(page)
    await validatesEmailAndPasswordFields(context, page)
    await canRegisterUser(browser, page)
  })
})

const password = 'JwoXk17wQSDCCEkl'
const email = 'foobar@barbaz.de'

const canRegisterUser = async (browser: Browser, page: Page) => {
  await (
    await withRandomUserSession(browser, async (page) => {
      await waitForElementByTestId(page, 'user-profile-full-name')
      // try to go to registration or login page with logged in user
      await page.goto('/registration')
      await waitForElementByTestId(page, 'user-profile-full-name')

      await page.goto('/login')
      await waitForElementByTestId(page, 'user-profile-full-name')
    })
  )()
}

const redirectsFromRegistrationToLoginAndBackToRegistration = async (page: Page) => {
  // redirects from Registration to Login and back to Registration
  await clickElementByTestId(page, 'btn-to-profile-view')
  // make sure we are on the login protection page before proceeding
  await waitForElementByTestId(page, 'login-protection-heading')

  // go to registration
  await clickElementByTestId(page, 'btn-to-registration-form')
  await page.waitForURL('**/registration')

  // switch to login
  await clickElementByTestId(page, 'btn-to-login-form')
  await page.waitForURL('**/login')

  // switch to registration again
  await clickElementByTestId(page, 'btn-to-registration-form')
  await page.waitForURL('**/registration')
}

const validatesEmailAndPasswordFields = async (context: BrowserContext, page: Page) => {
  // no password and email provided
  await defaultAuthSteps(
    {
      context,
      page,
      email: '',
      password: '',
    },
    'registration'
  )

  await waitForElementByTestId(page, 'ory-traits-email-input-error-message')
  await waitForElementByTestId(page, 'ory-password-input-error-message')
  await checkAccessibility(page)

  // invalid email provided
  await defaultAuthSteps(
    {
      context,
      page,
      email: '!!!wrong@',
      password,
    },
    'registration'
  )

  await waitForElementByTestId(page, 'ory-traits-email-input-error-message')

  // short password provided
  await defaultAuthSteps(
    {
      context,
      page,
      email,
      password: 'Sh0rt',
    },
    'registration'
  )

  await waitForElementByTestId(page, 'ory-password-input-error-message')

  // weak password provided
  await defaultAuthSteps(
    {
      context,
      page,
      email,
      password: '11111111',
    },
    'registration'
  )

  await waitForElementByTestId(page, 'ory-password-input-error-message')
}
