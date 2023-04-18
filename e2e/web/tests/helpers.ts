import { faker } from '@faker-js/faker'
import { Browser, BrowserContext, Locator, Page, expect } from '@playwright/test'
import { checkA11y, injectAxe } from 'axe-playwright'

import { test } from './testmaster'

// sometimes requests to the app backends take a little longer (10s < response latency < 40s)
export const donationsRequestTimeout = 40_000
export const goodnewsRequestTimeout = 20_000
export const volunteeringRequestTimeout = 20_000

// see https://playwright.dev/docs/selectors#id-data-testid-data-test-id-data-test-selectors
export const byTestId = (testId: string, nth?: number) => `[data-testid=${testId}]${nth ? ` >> nth=${nth}` : ''}`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const delay = (time: number) =>
  test.expect(false, "don't use delays, they are hiding test issues that we should fix directly").toBeTruthy()

export const locateElementByTestId = async (page: Page, testId: string, nth?: number): Promise<Locator> => {
  await page.waitForSelector(byTestId(testId))
  return page.locator(byTestId(testId, nth))
}

export const clickElement = async (locator: Locator): Promise<void> => {
  // potentially there are multiple matches, so we ensure to only click the first element
  await locator.first().click()
}

export const clickElementByTestId = async (page: Page, testId: string, nth?: number): Promise<void> => {
  return clickElement(await locateElementByTestId(page, testId, nth))
}

const prepareForLoginOrRegistration = async (context: BrowserContext, page: Page) => {
  await context.clearCookies()
  await page.goto('/profile')
}

export const gotoFillAndSubmitLogin = async (
  context: BrowserContext,
  page: Page,
  email: string,
  password: string
): Promise<void> => {
  await prepareForLoginOrRegistration(context, page)

  await clickElementByTestId(page, 'btn-to-login-form')

  const emailInput = await locateElementByTestId(page, 'ory-identifier-input')
  await emailInput.fill(email)

  const passwordInput = await locateElementByTestId(page, 'ory-password-input')
  await passwordInput.fill(password)

  await clickElementByTestId(page, 'ory-submit-password')
}

export const gotoFillAndSubmitRegistration = async (
  context: BrowserContext,
  page: Page,
  email: string,
  password: string,
  withAccountSetup = true
): Promise<void> => {
  await prepareForLoginOrRegistration(context, page)

  await clickElementByTestId(page, 'btn-to-registration-form')

  await waitForAnimationEnd(page, byTestId('stepper-scrollview'))

  await clickElementByTestId(page, 'community-guidelines-checkbox')

  await clickElementByTestId(page, 'holi-wizard-next-btn')

  await waitForAnimationEnd(page, byTestId('stepper-scrollview'))

  await clickElementByTestId(page, 'privacy-policy-checkbox')

  await clickElementByTestId(page, 'holi-wizard-next-btn')

  await waitForAnimationEnd(page, byTestId('stepper-scrollview'))

  const emailInput = await locateElementByTestId(page, 'ory-traits-email-input')
  await emailInput.fill(email)

  const passwordInput = await locateElementByTestId(page, 'ory-password-input')
  await passwordInput.fill(password)

  await clickElementByTestId(page, 'ory-submit-password')

  if (withAccountSetup) await finishAccountSetup(page)
}

export const finishAccountSetup = async (
  page: Page,
  {
    firstName = faker.name.firstName(),
    lastName = faker.name.lastName(),
    pronouns = '',
  }: {
    firstName?: string
    lastName?: string
    pronouns?: string
  } = {}
) => {
  // go through accound setup
  // provide user name
  const mandatoryFirtNameInput = await locateElementByTestId(page, 'first-name-input')
  await mandatoryFirtNameInput.fill(firstName)
  // provide user name
  const lastNameInput = await locateElementByTestId(page, 'last-name-input')
  await lastNameInput.fill(lastName)
  // provide user name
  const pronounsInput = await locateElementByTestId(page, 'pronouns-input')
  await pronounsInput.fill(pronouns)
  // submit name
  await clickElementByTestId(page, 'holi-wizard-next-btn')

  // submit pre-success step
  await page.waitForSelector(byTestId('account-setup-pre-registration-success-step'))
  await clickElementByTestId(page, 'holi-wizard-next-btn')
  // skip interests step
  await page.waitForSelector(byTestId('account-setup-interests-step'))
  await clickElementByTestId(page, 'holi-wizard-skip-btn')
  // skip location step
  await page.waitForSelector(byTestId('account-setup-location-step'))
  await clickElementByTestId(page, 'holi-wizard-skip-btn')
  // skip interests step
  await page.waitForSelector(byTestId('account-setup-success-step'))
  await clickElementByTestId(page, 'holi-wizard-next-btn')
}

export const proceedAsGuest = async (page: Page): Promise<void> => {
  await page.goto('/')
  // click the button and wait for it to be detached
  await Promise.all([
    page.waitForSelector(byTestId('btn-to-continue-as-guest'), { state: 'detached' }),
    clickElementByTestId(page, 'btn-to-continue-as-guest'),
  ])
}

export const loginAsE2EUser = async (context: BrowserContext, page: Page): Promise<void> => {
  test
    .expect(
      !!process.env.E2E_USER_USERNAME,
      'The environment variable E2E_USER_USERNAME is not set up correctly, please set it up.'
    )
    .toBeTruthy()
  test
    .expect(
      !!process.env.E2E_USER_PASSWORD,
      'The environment variable E2E_USER_PASSWORD is not set up correctly, please set it up.'
    )
    .toBeTruthy()
  await gotoFillAndSubmitLogin(
    context,
    page,
    process.env.E2E_USER_USERNAME as string,
    process.env.E2E_USER_PASSWORD as string
  )
  // wait for profile - login succeeded
  await page.waitForSelector(byTestId('user-profile-full-name'))
}

export const registerAsNewUser = async (
  context: BrowserContext,
  page: Page,
  email?: string,
  password?: string
): Promise<void> => {
  const emailToUse = email || newUserEmail()
  const passwordToUse = password || newUserPassword
  await gotoFillAndSubmitRegistration(context, page, emailToUse, passwordToUse)
  // wait for profile - registration succeeded
  await page.waitForSelector(byTestId('user-profile-full-name'))
}

export const checkAccessibility = async (page: Page) => {
  await injectAxe(page)
  const axeOptions = {
    rules: {
      region: { enabled: true }, // https://dequeuniversity.com/rules/axe/4.4/region
    },
  }
  // set skipFailures to true for now, so we can fix the issues in a planned task
  await checkA11y(page, undefined, { axeOptions, detailedReport: true, detailedReportOptions: { html: true } }, true)
}

export const sendConnectionRequest = async (page: Page) => {
  // visit another user's profile page via url
  const userId = process.env.E2E_USER_ID
  // test won't work if userId is not defined
  expect(userId?.length).toBe(36)
  await page.goto('/profile/' + userId)
  // because we do a hard navigation we need to wait for logged in user to be fetched from BE. So, wait for 'logged-in-profile'
  await page.waitForSelector(byTestId('logged-in-profile'))
  await page.waitForSelector(byTestId('user-profile-full-name'))

  // for the newly created user, the button state should be NOT_CONNECTED
  await clickElementByTestId(page, 'user-connection-button-NOT_CONNECTED')

  // after clicked, the button state should change to REQUESTED
  await page.waitForSelector(byTestId('user-connection-button-REQUESTED'), { state: 'detached' })
}

export const newUserEmail = () => {
  return `${faker.internet.userName()}${faker.random.numeric(4)}@e2etest.com`
}
export const newUserPassword = 'TheSamePassword4A11E2eUsers'

export const withRandomUserSession = async (
  browser: Browser,
  actions: (page: Page) => Promise<void>,
  email: string = newUserEmail(),
  password: string = newUserPassword
): Promise<() => Promise<void>> => {
  const context = await browser.newContext()
  const page = await context.newPage()

  await registerAsNewUser(context, page, email, password)
  // wait for login to complete
  await page.waitForSelector(byTestId('user-profile-full-name'))
  await actions(page)
  return async () => {
    await deleteUser(page)
    await context.close()
  }
}

const deleteUser = async (page: Page) => {
  await page.goto('/profile')
  await page.waitForSelector(byTestId('user-profile-full-name'))
  await clickElementByTestId(page, 'btn-to-settings')
  await clickElementByTestId(page, 'btn-your-account')
  await clickElementByTestId(page, 'btn-delete-account')
  await clickElementByTestIdAndWaitForToast(page, 'account-deletion-confirmation-confirmation-confirm', 'toast-SUCCESS')
  await page.waitForSelector(byTestId('login-protection-heading'))
}

export const clickElementByTestIdAndWaitForToast = async (page: Page, elementId: string, toastId: string) => {
  await Promise.all([clickElementByTestId(page, elementId), page.waitForSelector(byTestId(toastId))])
}

export const clickElementByTestIdAndWaitForToastFinish = async (page: Page, elementId: string, toastId: string) => {
  await clickElementByTestIdAndWaitForToast(page, elementId, toastId)
  await page.waitForSelector(byTestId(toastId), { state: 'detached' })
}

export const waitForAnimationEnd = async (page: Page, locatorString: string): Promise<void> => {
  await (await page.waitForSelector(locatorString)).waitForElementState('stable')
  await page
    .locator(locatorString)
    .evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
}
