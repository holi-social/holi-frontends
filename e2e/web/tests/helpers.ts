import { Locator, Page } from '@playwright/test'

// see https://playwright.dev/docs/selectors#id-data-testid-data-test-id-data-test-selectors
export const byTestId = (testId: string) => `[data-testid=${testId}]`

export const delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time * 1000))

export const waitForAnimationEnd = (locator: Locator) => {
  return locator.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
}

type DefaultLoginStepsProps = {
  page: Page
  username?: string
  password?: string
}

export const defaultLoginSteps = async ({ page, username, password }: DefaultLoginStepsProps) => {
  await page.locator(byTestId('btn-to-profile-view')).click()
  await page.locator(byTestId('btn-to-login-form')).click()
  await page.locator(byTestId('ory-input-identifier-input')).fill(username || process.env.E2E_USER_USERNAME || 'empty')
  await page.locator(byTestId('ory-input-password-input')).fill(password || process.env.E2E_USER_PASSWORD || 'empty')
  await page.locator(byTestId('ory-submit-method')).click()
}

