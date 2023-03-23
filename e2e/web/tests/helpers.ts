import { faker } from '@faker-js/faker'
import { Browser, BrowserContext, ElementHandle, Locator, Page, expect } from '@playwright/test'
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

export const waitForElementByTestId = async (
  page: Page,
  testId: string,
  options?: { timeout?: number }
): Promise<ElementHandle<SVGElement | HTMLElement>> => {
  return await page.waitForSelector(byTestId(testId), options)
}

export const waitForElementByTestIdToBeDetached = async (page: Page, testId: string) =>
  page.waitForSelector(byTestId(testId), { state: 'detached' })

export const locateElementByTestId = async (page: Page, testId: string, nth?: number): Promise<Locator> => {
  await waitForElementByTestId(page, testId)
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
  password: string
): Promise<void> => {
  await prepareForLoginOrRegistration(context, page)

  await clickElementByTestId(page, 'btn-to-registration-form')

  await clickElementByTestId(page, 'community-guidelines-checkbox')

  await clickElementByTestId(page, 'holi-wizard-next-btn')

  await clickElementByTestId(page, 'privicy-policy-checkbox')

  await clickElementByTestId(page, 'holi-wizard-next-btn')

  const emailInput = await locateElementByTestId(page, 'ory-traits-email-input')
  await emailInput.fill(email)

  const passwordInput = await locateElementByTestId(page, 'ory-password-input')
  await passwordInput.fill(password)

  await clickElementByTestId(page, 'ory-submit-password')
}

export const proceedAsGuest = async (page: Page): Promise<void> => {
  await page.goto('/')
  // click the button and wait for it to be detached
  await Promise.all([
    waitForElementByTestIdToBeDetached(page, 'btn-to-continue-as-guest'),
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
  await waitForElementByTestId(page, 'btn-to-settings')
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
  await waitForElementByTestId(page, 'btn-to-settings')
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
  await waitForElementByTestId(page, 'user-profile-full-name')

  // for the newly created user, the button state should be NOT_CONNECTED
  await clickElementByTestId(page, 'user-connection-button-NOT_CONNECTED')

  // after clicked, the button state should change to REQUESTED
  await waitForElementByTestIdToBeDetached(page, 'user-connection-button-REQUESTED')
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
  await page.waitForSelector(byTestId('btn-to-settings'))
  await actions(page)
  return async () => {
    await deleteUser(page)
    await context.close()
  }
}

const deleteUser = async (page: Page) => {
  await page.goto('/profile')
  await waitForElementByTestId(page, 'user-profile-full-name')
  await clickElementByTestId(page, 'btn-to-settings')
  await clickElementByTestId(page, 'btn-your-account')
  await clickElementByTestId(page, 'btn-delete-account')
  await clickElementByTestIdAndWaitForToast(page, 'account-deletion-confirmation-confirmation-confirm', 'toast-SUCCESS')
  await waitForElementByTestId(page, 'login-protection-heading')
}

export const clickElementByTestIdAndWaitForToast = async (page: Page, elementId: string, toastId: string) => {
  await Promise.all([clickElementByTestId(page, elementId), page.waitForSelector(byTestId(toastId))])
}

export const clickElementByTestIdAndWaitForToastFinish = async (page: Page, elementId: string, toastId: string) => {
  await clickElementByTestIdAndWaitForToast(page, elementId, toastId)
  await waitForElementByTestIdToBeDetached(page, toastId)
}
