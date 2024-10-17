import { faker } from '@faker-js/faker'
import { Browser, BrowserContext, Locator, Page, expect } from '@playwright/test'
import { checkA11y, configureAxe, injectAxe } from 'axe-playwright'

import { deleteAuthenticatedAccount } from '@holi/e2e-web/tests/helpers/api'
import { newUserEmail, newUserPassword, randomPassword } from '@holi/e2e-web/tests/helpers/fixtures'

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

/*
 * Only use for text that is provided by the test (fixture)
 */
export const clickButtonByText = async (page: Page, buttonText: string): Promise<void> => {
  await page.click(`button:has-text("${buttonText}")`)
}

export const dismissConsentDialog = (page: Page) => page.getByRole('button', { name: 'Decline all' }).click()

export const denyConsent = async (page: Page) => {
  // Store the denial in local storage
  await page.evaluate(() => {
    localStorage.setItem('HOLI_TRACKING_CONSENT', '{"ANALYTICS":"denied","PERSONALIZATION":"denied"}')
  })
  // Now reload the page - the consent logic will read what's in local storage and not show the dialog
  await page.reload()
}

const prepareForLoginOrRegistration = async (context: BrowserContext, page: Page) => {
  await context.clearCookies()
  await denyConsent(page)
}

export const login = async (context: BrowserContext, page: Page, email: string, password: string): Promise<void> => {
  await page.goto('/login')

  await prepareForLoginOrRegistration(context, page)

  const emailInput = await locateElementByTestId(page, 'ory-identifier-input')
  await emailInput.fill(email)

  const passwordInput = await locateElementByTestId(page, 'ory-password-input')
  await passwordInput.fill(password)

  await clickElementByTestId(page, 'ory-submit-password')
}

export const registerUserAccount = async (
  context: BrowserContext,
  page: Page,
  email: string,
  password: string
): Promise<{ fullName: string }> => {
  await registerUser(context, page, email, password)
  return await finishAccountSetup(page)
}

export const registerUser = async (
  context: BrowserContext,
  page: Page,
  email: string,
  password: string
): Promise<void> => {
  await page.goto('/onboarding/registration')
  await prepareForLoginOrRegistration(context, page)

  await page.getByRole('checkbox', { name: 'I respect the Terms of Use and the Community Guidelines' }).check()
  await page.getByRole('button', { name: 'Next' }).click()
  await page.getByRole('checkbox', { name: 'I have read and understood the privacy policy.' }).check()
  await page.getByRole('button', { name: 'Next' }).click()

  await page.getByRole('textbox', { name: 'Email' }).fill(email)
  await page.getByRole('textbox', { name: 'Password' }).fill(password)

  await page.getByRole('button', { name: 'Sign up' }).click()
}

export const finishAccountSetup = async (
  page: Page,
  {
    firstName = faker.person.firstName(),
    lastName = faker.person.lastName(),
  }: {
    firstName?: string
    lastName?: string
  } = {}
): Promise<{ fullName: string }> => {
  // go through account setup
  // provide user names
  const firstNameInput = await locateElementByTestId(page, 'first-name-input')
  await firstNameInput.fill(firstName)

  const lastNameInput = await locateElementByTestId(page, 'last-name-input')
  await lastNameInput.fill(lastName)
  // submit
  await clickElementByTestId(page, 'holi-wizard-save-btn')

  // submit pre-success step
  await page.waitForSelector(byTestId('account-setup-pre-registration-success-step'))
  await clickElementByTestId(page, 'holi-wizard-save-btn')
  // skip interests step
  await page.waitForSelector(byTestId('account-setup-interests-step-headline'))
  await clickElementByTestId(page, 'holi-wizard-save-btn')
  // skip location step
  await page.waitForSelector(byTestId('account-setup-location-step-headline'))
  await clickElementByTestId(page, 'holi-wizard-save-btn')
  // skip interests step
  await page.waitForSelector(byTestId('account-setup-success-step'))
  await clickElementByTestId(page, 'holi-wizard-save-btn')

  return {
    fullName: firstName + ' ' + lastName,
  }
}

export const proceedAsGuest = async (page: Page): Promise<void> => {
  //Introduced exception handling if first attempt to hit the server does not succeed
  await gotoWithRetries(page, '/')

  await denyConsent(page)
  await Promise.all([
    page.waitForSelector(byTestId('btn-to-onboarding'), { state: 'detached' }),
    clickElementByTestId(page, 'btn-to-onboarding'),
  ])
  await clickElementByTestId(page, 'holi-wizard-skip-btn')
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
  await login(context, page, process.env.E2E_USER_USERNAME as string, process.env.E2E_USER_PASSWORD as string)
  // wait for profile - login succeeded
  await page.waitForSelector(byTestId('home-feed-insights-heading'))
}

export const registerNewUserAccount = async (
  context: BrowserContext,
  page: Page,
  email?: string,
  password?: string
): Promise<{ fullName: string }> => {
  const emailToUse = email || newUserEmail()
  const passwordToUse = password || newUserPassword
  const newAccount = await registerUserAccount(context, page, emailToUse, passwordToUse)
  // wait for home feed - registration succeeded
  await page.waitForSelector(byTestId('home-feed-insights-heading'))
  return newAccount
}

export const checkAccessibility = async (page: Page, failOnError = true) => {
  console.debug('check accessibility for', page.url())
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
    ],
  })
  await checkA11y(page, undefined, axeOptions, !failOnError)
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

export const withRandomUserSession = async (
  browser: Browser,
  actions: (page: Page, userFullName: string) => Promise<void>,
  email: string = newUserEmail(),
  password: string = randomPassword()
): Promise<() => Promise<void>> => {
  const context = await browser.newContext()
  const page = await context.newPage()

  const newAccount = await registerNewUserAccount(context, page, email, password)

  // If the initial attempt fails, fall back to retry logic
  await gotoWithRetries(page, '/profile')

  await page.waitForSelector(byTestId('user-profile-full-name'))

  await actions(page, newAccount.fullName)

  return async () => {
    await deleteAuthenticatedAccount(context)
    await context.close()
  }
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
    timeout: 20_000,
  })
}

export const withSSR = async (
  browser: Browser,
  url: string,
  actions: (page: Page, options?: { testSSR?: boolean }) => Promise<void>
): Promise<void> => {
  const context = await browser.newContext({ javaScriptEnabled: false })
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
