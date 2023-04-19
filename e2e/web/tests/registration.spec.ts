import { BrowserContext, Page } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  gotoFillAndSubmitRegistration,
  proceedAsGuest,
  waitForAnimationEnd,
} from './helpers'
import { UserHandler, test } from './testmaster'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.envrc' })

test.setTimeout(120000)
test.describe('@Registration', () => {
  test('user journey', async ({ context, page, userHandler }) => {
    await proceedAsGuest(page)
    await redirectsFromRegistrationToLoginAndBackToRegistration(page)
    await validatesEmailAndPasswordFields(context, page)
    await canRegisterUser(userHandler)
  })
})

const redirectsFromRegistrationToLoginAndBackToRegistration = async (page: Page) => {
  // redirects from Registration to Login and back to Registration
  await clickElementByTestId(page, 'btn-to-profile-view')
  // make sure we are on the login protection page before proceeding
  await page.waitForSelector(byTestId('login-protection-heading'))

  // go to registration
  await clickElementByTestId(page, 'btn-to-registration-form')
  await waitForAnimationEnd(page, byTestId('stepper-scrollview'))
  // make sure we have started the wizard
  await clickElementByTestId(page, 'community-guidelines-checkbox')
  await clickElementByTestId(page, 'holi-wizard-next-btn')
  await waitForAnimationEnd(page, byTestId('stepper-scrollview'))
  await clickElementByTestId(page, 'privacy-policy-checkbox')
  await clickElementByTestId(page, 'holi-wizard-next-btn')
  await waitForAnimationEnd(page, byTestId('stepper-scrollview'))

  // switch to login
  await clickElementByTestId(page, 'btn-to-login-form')
  await page.waitForURL('**/login')

  // switch to registration again
  await clickElementByTestId(page, 'btn-to-registration-form')
  await waitForAnimationEnd(page, byTestId('stepper-scrollview'))
  await page.waitForSelector(byTestId('community-guidelines-checkbox'))
}

const validatesEmailAndPasswordFields = async (context: BrowserContext, page: Page) => {
  const validPassword = 'JwoXk17wQSDCCEkl'
  const validEmail = 'foobar@barbaz.de'

  // no password and email provided
  await gotoFillAndSubmitRegistration(context, page, '', '', false)
  await page.waitForSelector(byTestId('ory-traits-email-input-error-message'))
  await page.waitForSelector(byTestId('ory-password-input-error-message'))
  await checkAccessibility(page)

  // invalid email provided
  await gotoFillAndSubmitRegistration(context, page, '!!!wrong@', validPassword, false)
  await page.waitForSelector(byTestId('ory-traits-email-input-error-message'))

  // short password provided
  await gotoFillAndSubmitRegistration(context, page, validEmail, 'Sh0rt', false)
  await page.waitForSelector(byTestId('ory-password-input-error-message'))

  // weak password provided
  await gotoFillAndSubmitRegistration(context, page, validEmail, '11111111', false)
  await page.waitForSelector(byTestId('ory-password-input-error-message'))
}

const canRegisterUser = async (userHandler: UserHandler) => {
  // using a random user session implicitly tests user registration
  await userHandler.asRandomUser(async (page) => {
    await page.waitForSelector(byTestId('user-profile-full-name'))
    // trying to go to login page with logged in user should show profile
    await page.goto('/login')
    await page.waitForSelector(byTestId('user-profile-full-name'))
  })
}
