import { BrowserContext, Page } from '@playwright/test'

import {
  byTestId,
  checkAccessibility,
  clickElementByTestId,
  proceedAsGuest,
  randomPassword,
  registerUser,
  waitForAnimationEnd,
} from './helpers'
import { UserHandler, test } from './testmaster'

test.setTimeout(120000)
test.describe('@Registration', () => {
  test('user journey', async ({ context, page, userHandler, browserName }) => {
    await proceedAsGuest(page)
    await redirectsFromRegistrationToLoginAndBackToRegistration(page)
    await validatesEmailAndPasswordFields(context, page)
    await canRegisterUser(userHandler, browserName === 'webkit')
  })
})

const redirectsFromRegistrationToLoginAndBackToRegistration = async (page: Page) => {
  // redirects from Registration to Login and back to Registration
  await clickElementByTestId(page, 'btn-to-profile-view')
  // make sure we are on the login protection page before proceeding
  await page.waitForSelector(byTestId('anonymous-profile-login-btn'))

  // go to registration
  await clickElementByTestId(page, 'btn-to-registration-form')
  await waitForAnimationEnd(page, byTestId('stepper-scrollview'))
  // make sure we have started the wizard
  await clickElementByTestId(page, 'community-guidelines-checkbox')
  await clickElementByTestId(page, 'community-guidelines-navbtn-next-btn')
  await waitForAnimationEnd(page, byTestId('stepper-scrollview'))
  await clickElementByTestId(page, 'privacy-policy-checkbox')
  await clickElementByTestId(page, 'privacy-policy-navbtn-next-btn')
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
  const validPassword = randomPassword()
  const validEmail = 'foobar@barbaz.de'

  // no password and email provided
  await registerUser(context, page, '', '')
  await page.waitForSelector(byTestId('ory-traits-email-input-error-message'))
  await page.waitForSelector(byTestId('ory-password-input-error-message'))
  await checkAccessibility(page)

  // invalid email provided
  await registerUser(context, page, '!!!wrong@', validPassword)
  await page.waitForSelector(byTestId('ory-traits-email-input-error-message'))

  // short password provided
  await registerUser(context, page, validEmail, 'Sh0rt')
  await page.waitForSelector(byTestId('ory-password-input-error-message'))

  // weak password provided
  await registerUser(context, page, validEmail, '11111111')
  await page.waitForSelector(byTestId('ory-password-input-error-message'))
}

const canRegisterUser = async (userHandler: UserHandler, isWebkit: boolean) => {
  // using a random user session implicitly tests user registration
  await userHandler.asRandomUser(async (page) => {
    await page.waitForSelector(byTestId('user-profile-full-name'))

    // FIXME: After Expo upgrade to 49 Mobile_WebKit has a bug `Error: page.goto: Navigation to "http://localhost:3000/login" is interrupted by another navigation to "http://localhost:3000/profile"`
    if (isWebkit) return

    // trying to go to login page with logged in user should show home feed
    await page.goto('/login')
    await page.waitForSelector(byTestId('home-feed-insights-heading'))
  })
}
