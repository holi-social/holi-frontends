import { BrowserContext, Locator, Page } from '@playwright/test'
import { checkA11y } from 'axe-playwright'

// see https://playwright.dev/docs/selectors#id-data-testid-data-test-id-data-test-selectors
export const byTestId = (testId: string) => `[data-testid=${testId}]`

export const delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time * 1000))

export const waitForElementByTestId = async (page: Page, testId: string) => {
  const selector = byTestId(testId)
  await page.waitForSelector(selector)
  return selector
}

export const locateElementByTestId = async (page: Page, testId: string) => {
  const selector = await waitForElementByTestId(page, testId)
  return page.locator(selector)
}

export const clickElementByTestId = async (page: Page, testId: string) => {
  const button = await locateElementByTestId(page, testId)
  // Only click the first element if there are multiple matches
  await button.first().click()
}

export const waitForAnimationEnd = async (locator: Locator) => {
  return locator.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
}

type DefaultLoginStepsProps = {
  page: Page
  context: BrowserContext
  username?: string
  password?: string
}

export const defaultLoginSteps = async ({ page, context, username, password }: DefaultLoginStepsProps) => {
  await context.clearCookies()

  await clickElementByTestId(page, 'btn-to-profile-view')
  await clickElementByTestId(page, 'btn-to-login-form')

  const emailInput = await locateElementByTestId(page, 'ory-identifier-input')
  await emailInput.fill(username || process.env.E2E_USER_USERNAME || 'empty')

  const passwordInput = await locateElementByTestId(page, 'ory-password-input')
  await passwordInput.fill(password || process.env.E2E_USER_PASSWORD || 'empty')

  await clickElementByTestId(page, 'ory-submit-method')
}

export const checkAccessibility = async (page: Page) => {
  const axeOptions = {
    rules: {
      region: { enabled: true }, // https://dequeuniversity.com/rules/axe/4.4/region
    },
  }
  // set skipFailures to true for now, so we can fix the issues in a planned task
  await checkA11y(page, undefined, { axeOptions, detailedReport: true, detailedReportOptions: { html: true } }, true)
}
