import { faker } from '@faker-js/faker'
import { Browser, BrowserContext, Locator, Page, expect } from '@playwright/test'
import { checkA11y, injectAxe } from 'axe-playwright'

// see https://playwright.dev/docs/selectors#id-data-testid-data-test-id-data-test-selectors
export const byTestId = (testId: string) => `[data-testid=${testId}]`

export const delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time * 1000))

export const waitForElementByTestId = async (page: Page, testId: string): Promise<string> => {
  const selector = byTestId(testId)
  await page.waitForSelector(selector) // default timeout: 30s
  return selector
}

export const locateElementByTestId = async (page: Page, testId: string): Promise<Locator> => {
  const selector = await waitForElementByTestId(page, testId)
  return page.locator(selector)
}

export const waitForElementByInnerText = async (page: Page, text: string): Promise<void> => {
  return await page.locator(`text=${text}`).waitFor()
}

export const locateElementBySelector = async (page: Page, selector: string): Promise<Locator> => {
  await page.waitForSelector(selector)
  return page.locator(selector)
}

export const clickElement = async (element: Locator) => {
  await delay(0.5) // source of flakiness and delay. Why do we need this here? Component is there, but click does not work when done too early.
  // potentially there are multiple matches, so we ensure to only click the first element
  await element.first().click()
}

export const clickElementByTestId = async (page: Page, testId: string) => {
  const button = await locateElementByTestId(page, testId)
  await clickElement(button)
}

export const waitForAnimationEnd = async (locator: Locator) => {
  return locator.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
}

const defaultPassword = 'TheSamePassword4A11E2eUsers'

export const registerNewUser = async ({ page, context }: PageContext) => {
  const email = `${faker.internet.userName()}${faker.random.numeric(4)}@e2etest.com`
  await defaultAuthSteps({ page, context, email, password: defaultPassword }, 'registration')
}

interface PageContext {
  page: Page
  context: BrowserContext
}

interface DefaultAuthStepsProps extends PageContext {
  email?: string
  password?: string
}

type BrowserAuthStepsProps = {
  browser: Browser
  email?: string
  password?: string
}

export const defaultAuthSteps = async (
  {
    page,
    context,
    email = process.env.E2E_USER_USERNAME || 'empty',
    password = process.env.E2E_USER_PASSWORD || 'empty',
  }: DefaultAuthStepsProps,
  mode: 'login' | 'registration' = 'login'
): Promise<void> => {
  const isLogin = mode === 'login'

  await context.clearCookies()

  await page.goto('/profile')
  await clickElementByTestId(page, isLogin ? 'btn-to-login-form' : 'btn-to-registration-form')

  if (!isLogin) {
    await clickElementByTestId(page, 'privicy-policy-checkbox')
    await clickElementByTestId(page, 'holi-wizard-next-btn')
  }

  const emailInput = await locateElementByTestId(page, isLogin ? 'ory-identifier-input' : 'ory-traits-email-input')
  await emailInput.fill(email)

  const passwordInput = await locateElementByTestId(page, 'ory-password-input')
  await passwordInput.fill(password)

  if (!isLogin) {
    const acceptConsentCheckbox = await locateElementByTestId(page, 'ory-checkbox-traits_consent')
    await acceptConsentCheckbox.click()
  }

  await clickElementByTestId(page, 'ory-submit-method')
}

export const deleteAccount = async (page: Page) => {
  await page.goto('/profile')

  await clickElementByTestId(page, 'btn-to-settings')
  await clickElementByTestId(page, 'btn-your-account')
  await clickElementByTestId(page, 'btn-delete-account')
  await clickElementByTestId(page, 'account-deletion-confirmation-confirmation-confirm')

  await waitForElementByTestId(page, 'btn-to-login-form')
  await clickElementByTestId(page, 'btn-to-home-view')
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
  await page.waitForSelector(byTestId('user-connection-button-REQUESTED'), { state: 'detached' })
}

const newUserEmail = () => {
  return `${faker.internet.userName()}${faker.random.numeric(4)}@e2etest.com`
}
const newUserPassword = 'TheSamePassword4A11E2eUsers'

export const withRandomUserSession = async (
  browser: Browser,
  actions: (page: Page) => Promise<void>
): Promise<() => Promise<void>> => {
  const context = await browser.newContext()
  const page = await context.newPage()
  const email = newUserEmail()
  const password = newUserPassword

  await page.goto('/')
  await defaultAuthSteps({ context, page, email, password }, 'registration')
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
  await clickElementByTestId(page, 'account-deletion-confirmation-confirmation-confirm')
  await waitForElementByTestId(page, 'login-protection-heading')
}
