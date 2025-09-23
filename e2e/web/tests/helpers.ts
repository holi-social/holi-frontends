import { faker } from '@faker-js/faker'
import { type Browser, type Locator, type Page, expect } from '@playwright/test'
import { checkA11y, configureAxe, injectAxe } from 'axe-playwright'

import { test } from './testmaster'

// sometimes requests to the app backends take a little longer (10s < response latency < 40s)
export const donationsRequestTimeout = 40_000
export const goodnewsRequestTimeout = 20_000
export const volunteeringRequestTimeout = 40_000

// see https://playwright.dev/docs/selectors#id-data-testid-data-test-id-data-test-selectors
export const byTestId = (testId: string, nth?: number) => `[data-testid='${testId}']${nth ? ` >> nth=${nth}` : ''}`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const delay = (time: number) =>
  test.expect(false, "don't use delays, they are hiding test issues that we should fix directly").toBeTruthy()

export const locateElementByTestId = async (page: Page, testId: string, nth?: number): Promise<Locator> => {
  return page.locator(byTestId(testId, nth))
}

export const clickFirstElement = async (locator: Locator): Promise<void> => {
  await locator.first().click()
}

export const clickElementByTestId = async (page: Page, testId: string, nth?: number): Promise<void> => {
  return clickFirstElement(await locateElementByTestId(page, testId, nth))
}

export const clickElementByAriaLabel = async (page: Page, label: string): Promise<void> => {
  return clickFirstElement(page.getByLabel(label))
}

export const clickThisOrThatElementByTestId = async (page: Page, testIdA: string, testIdB: string): Promise<void> => {
  return clickFirstElement(page.locator(`[data-testid='${testIdA}'], [data-testid='${testIdB}']`))
}
/*
 * Only use for text that is provided by the test (fixture)
 */
export const clickButtonByText = async (page: Page, buttonText: string): Promise<void> => {
  await page.click(`button:has-text("${buttonText}")`)
}

export const login = async (page: Page, email: string, password: string) => {
  await page.context().clearCookies()

  await page.goto('/login')
  await page.getByRole('button', { name: 'Continue with email and password' }).click()

  await page.getByRole('textbox', { name: 'Email' }).fill(email)
  await page.getByRole('textbox', { name: 'Password' }).fill(password)

  await page.getByRole('button', { name: 'Log in' }).click()
}

export const proceedAsGuest = async (page: Page): Promise<void> => {
  await page.goto('/onboarding')

  await page.getByRole('button', { name: "Let's go" }).click()
  await page.getByRole('button', { name: 'Continue as a guest' }).click()

  await page.getByLabel('Bottom navigation').getByText('Feed').click()
}

export const loginAsE2EUser = async (page: Page) => {
  test.expect(!!process.env.E2E_USER_USERNAME, 'Env E2E_USER_USERNAME is set up correctly').toBeTruthy()
  test.expect(!!process.env.E2E_USER_PASSWORD, 'Env E2E_USER_PASSWORD is set up correctly').toBeTruthy()

  await login(page, process.env.E2E_USER_USERNAME as string, process.env.E2E_USER_PASSWORD as string)
  await expect(page.getByLabel('Bottom navigation').getByText('Me')).toBeVisible()
}

export const checkAccessibility = async (page: Page, failOnError = true) => {
  await injectAxe(page)
  const axeOptions = {
    rules: {
      region: { enabled: true }, // https://dequeuniversity.com/rules/axe/4.4/region
      duplicateId: false,
    },
    detailedReport: true,
    detailedReportOptions: { html: true },
  }
  // Disabled 'color-contrast' for now to not distract from more serious issues
  await configureAxe(page, {
    rules: [
      { id: 'color-contrast', enabled: false },
      { id: 'scrollable-region-focusable', enabled: false }, // TODO: Fix HoliStepper issue with this rule
      { id: 'duplicate-id', enabled: false }, // svg icon components rendered in lists have duplicated ids for their shape masks
      { id: 'nested-interactive', enabled: false }, // todo gregor: check why the bottom bar nav is a concern in multiple tests
      { id: 'page-has-heading-one', enabled: false },
    ],
  })

  await test.step('Web page is accessible: ' + page.url(), async () => {
    await checkA11y(page, undefined, axeOptions, !failOnError)
  })
}

export const sendConnectionRequest = async (page: Page) => {
  // visit another user's profile page via url
  const userId = process.env.E2E_USER_ID
  // test won't work if userId is not defined
  expect(userId?.length).toBe(36)
  await gotoWithRetries(page, '/profile/' + userId)

  // because we do a hard navigation we need to wait for logged in user to be fetched from BE. So, wait for 'logged-in-profile'
  await page.waitForSelector(byTestId('logged-in-profile'))
  await page.waitForSelector(byTestId('user-profile-full-name'))

  // for the newly created user, the button state should be NOT_CONNECTED
  await clickElementByTestId(page, 'user-connection-button-NOT_CONNECTED')

  // after clicked, the button state should change to REQUESTED
  await page.waitForSelector(byTestId('user-connection-button-REQUESTED'), { state: 'detached' })
}

/*Generates a random space name using a combination of an animal type and a random number*/

export const randomSpaceName = () => {
  return faker.animal.type() + faker.number.int()
}

export const clickElementByTestIdAndWaitForToast = async (page: Page, elementId: string, toastId: string) => {
  await Promise.all([clickElementByTestId(page, elementId), page.waitForSelector(byTestId(toastId))])
}

export const clickElementByTestIdAndWaitForToastFinish = async (page: Page, elementId: string, toastId: string) => {
  await clickElementByTestIdAndWaitForToast(page, elementId, toastId)
  await page.waitForSelector(byTestId(toastId), { state: 'detached' })
}

/*
 * This function will wait for any movement or resizing of the element(s) matching the passed in locator.
 * This will NOT WAIT for fading in and out, because it does only measure changes in the bounding box of the
 * elements.
 */
export const waitForAnimationEnd = async (page: Page, locatorString: string): Promise<void> => {
  const element = page.locator(locatorString)
  await element.waitFor()
}

/*
 * Wrap around a multi-step expectation that needs its steps retried
 * for features with unpredictable background work
 * think: re-freshing or re-clicking
 *
 * Be sure to have an expect() in the expectationFn
 * otherwise, it will not throw and just pass
 *
 * Be aware that the test itself is also retried in CI
 */
export const retry = async (expectationFn: () => Promise<void>) => {
  await expect(async () => {
    await expectationFn()
  }).toPass({
    intervals: [3_000],
    timeout: 30_000,
  })
}

export const withSSR = async (
  browser: Browser,
  url: string,
  actions: (page: Page, options?: { testSSR?: boolean }) => Promise<void>
): Promise<void> => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    userAgent:
      'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  })
  const page = await context.newPage()
  // Retry the navigation if it fails
  await gotoWithRetries(page, url) // Fix: remove quotes around 'url'

  // Execute the provided actions
  await actions(page, { testSSR: true })

  // Close the context to clean up
  await context.close()
}

export async function scrollToMakeHeaderVisible(page: Page) {
  // Wait for the page to load
  await page.waitForLoadState()

  // Scroll down and then scroll up to trigger the modal
  await page.mouse.wheel(0, 600)
  await page.mouse.wheel(0, -750)
}

export async function gotoWithRetries(page: Page, url: string, retries = 3, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 20000 })
      break
    } catch (error) {
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.error(`Attempt ${attempt} to navigate to ${url} failed: ${error.message}`)
      } else {
        // eslint-disable-next-line no-console
        console.error(`Attempt ${attempt} to navigate to ${url} failed: Unknown error`)
      }

      if (attempt < retries) {
        await page.waitForTimeout(delay)
      } else {
        throw new Error(`Failed to load ${url} after ${retries} attempts`)
      }
    }
  }
}

export const isRunningLocally = () => {
  return process.env.BASE_URL === 'http://localhost:3000'
}
