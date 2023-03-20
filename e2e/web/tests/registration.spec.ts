import { BrowserContext, Page } from '@playwright/test'

import {
  checkAccessibility,
  clickElementByTestId,
  gotoFillAndSubmitRegistration,
  proceedAsGuest,
  waitForElementByTestId,
} from './helpers'
import { UserHandler, test } from './testmaster'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.describe('@Registration', () => {
  test('user journey', async ({ context, page, userHandler }) => {
    await proceedAsGuest(page)
    await redirectsFromRegistrationToLoginAndBackToRegistration(page)
    await validatesEmailAndPasswordFields(context, page)
    await canRegisterUser(userHandler)
  })
})

const password = 'JwoXk17wQSDCCEkl'
const email = 'foobar@barbaz.de'

const redirectsFromRegistrationToLoginAndBackToRegistration = async (page: Page) => {
  // redirects from Registration to Login and back to Registration
  await clickElementByTestId(page, 'btn-to-profile-view')
  // make sure we are on the login protection page before proceeding
  await waitForElementByTestId(page, 'login-protection-heading')

  // go to registration
  await clickElementByTestId(page, 'btn-to-registration-form')
  // make sure we have started the wizard
  await clickElementByTestId(page, 'community-guidelines-checkbox')
  await clickElementByTestId(page, 'holi-wizard-next-btn')
  await clickElementByTestId(page, 'privicy-policy-checkbox')
  await clickElementByTestId(page, 'holi-wizard-next-btn')

  // switch to login
  await clickElementByTestId(page, 'btn-to-login-form')
  await page.waitForURL('**/login')

  // switch to registration again
  await clickElementByTestId(page, 'btn-to-registration-form')
  await waitForElementByTestId(page, 'community-guidelines-checkbox')
}

const validatesEmailAndPasswordFields = async (context: BrowserContext, page: Page) => {
  // no password and email provided
  await gotoFillAndSubmitRegistration(context, page, '', '')
  await waitForElementByTestId(page, 'ory-traits-email-input-error-message')
  await waitForElementByTestId(page, 'ory-password-input-error-message')
  await checkAccessibility(page)

  // invalid email provided
  await gotoFillAndSubmitRegistration(context, page, '!!!wrong@', password)
  await waitForElementByTestId(page, 'ory-traits-email-input-error-message')

  // short password provided
  await gotoFillAndSubmitRegistration(context, page, email, 'Sh0rt')
  await waitForElementByTestId(page, 'ory-password-input-error-message')

  // weak password provided
  await gotoFillAndSubmitRegistration(context, page, email, '11111111')
  await waitForElementByTestId(page, 'ory-password-input-error-message')
}

const canRegisterUser = async (userHandler: UserHandler) => {
  await userHandler.asRandomUser(async (page) => {
    await waitForElementByTestId(page, 'user-profile-full-name')
    // try to go to registration or login page with logged in user
    await page.goto('/registration')
    await waitForElementByTestId(page, 'user-profile-full-name')

    await page.goto('/login')
    await waitForElementByTestId(page, 'user-profile-full-name')
  })
}
