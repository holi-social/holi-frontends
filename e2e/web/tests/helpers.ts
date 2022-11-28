import { BrowserContext, Locator, Page } from '@playwright/test'
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
  return clickElement(button)
}

export const waitForAnimationEnd = async (locator: Locator) => {
  return locator.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
}

type DefaultAuthStepsProps = {
  page: Page
  context: BrowserContext
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

  await page.goto('/')
  await clickElementByTestId(page, 'btn-to-profile-view')
  await clickElementByTestId(page, isLogin ? 'btn-to-login-form' : 'btn-to-registration-form')

  const emailInput = await locateElementByTestId(page, isLogin ? 'ory-identifier-input' : 'ory-traits-email-input')
  await emailInput.fill(email)

  const passwordInput = await locateElementByTestId(page, 'ory-password-input')
  await passwordInput.fill(password)

  return await clickElementByTestId(page, 'ory-submit-method')
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
