import { faker } from '@faker-js/faker'
import { type Browser, type BrowserContext, type Locator, type Page, expect } from '@playwright/test'
import { checkA11y, configureAxe, injectAxe } from 'axe-playwright'

import { deleteAuthenticatedAccount } from '@holi/e2e-web/tests/helpers/api'
import { newUserEmail, newUserPassword, randomPassword } from '@holi/e2e-web/tests/helpers/fixtures'

import { test } from './testmaster'
import type { OnboardingUserData } from '@holi/core/screens/onboarding/types'

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

  //Introduced exception handling if first attempt to hit the server does not succeed

  await gotoWithRetries(page, '/profile')

  await denyConsent(page)
}

export const login = async (context: BrowserContext, page: Page, email: string, password: string): Promise<void> => {
  await prepareForLoginOrRegistration(context, page)
  await clickElementByTestId(page, 'anonymous-profile-login-btn')

  const emailInput = await locateElementByTestId(page, 'ory-identifier-input')
  await emailInput.fill(email)

  const passwordInput = await locateElementByTestId(page, 'ory-password-input')
  await passwordInput.fill(password)

  await clickElementByTestId(page, 'ory-submit-password')
}

const registerUserAccount = async (
  context: BrowserContext,
  page: Page,
  {
    email,
    password,
    userData,
  }: {
    email: string
    password: string
    userData?: OnboardingUserData
  }
): Promise<{ fullName: string }> => {
  await gotoWithRetries(page, '/profile')

  await registerUser(context, page, { email, password, userData })
  return await finishAccountSetup(page)
}

const skipOnboardingInitialSteps = async (page: Page) => {
  await Promise.all([
    page.waitForSelector(byTestId('btn-to-onboarding'), { state: 'detached' }),
    clickElementByTestId(page, 'btn-to-onboarding'),
  ])

  const onboardingStepsToSkip = [
    'onboarding-content-selection',
    'onboarding-location-selection',
    'onboarding-interests-selection',
    'onboarding-skills-selection',
  ]
  for (const step of onboardingStepsToSkip) {
    await page.waitForSelector(byTestId(step))
    await clickElementByTestId(page, 'onboarding-stepper-nav-buttons-next-btn')
  }
}

const fillOutOnboarding = async (page: Page, userData: OnboardingUserData) => {
  await Promise.all([
    page.waitForSelector(byTestId('btn-to-onboarding'), { state: 'detached' }),
    clickElementByTestId(page, 'btn-to-onboarding'),
  ])

  // Handle content selection
  await page.waitForSelector(byTestId('onboarding-content-selection'))
  if (userData.content) {
    await clickElementByTestId(page, userData.content)
  }
  await clickElementByTestId(page, 'onboarding-stepper-nav-buttons-next-btn')
  // Handle location selection
  await page.waitForSelector(byTestId('onboarding-location-selection'))
  if (userData.location) {
    const locationInput = await locateElementByTestId(page, 'onboarding-location-selection-autocomplete-input')
    await locationInput.fill(userData.location.label)
    const locationOption = `onboarding-location-selection-autocomplete-item-${userData.location.id}`
    await page.waitForSelector(byTestId(locationOption))
    await clickElementByTestId(page, locationOption)
  }
  await clickElementByTestId(page, 'onboarding-stepper-nav-buttons-next-btn')
  // Handle interests selection
  await page.waitForSelector(byTestId('onboarding-interests-selection'))
  for (const slug of userData.interests) {
    await clickElementByTestId(page, `user-chip-form--${slug}-chip`)
  }
  await clickElementByTestId(page, 'onboarding-stepper-nav-buttons-next-btn')
  // Handle skills selection
  await page.waitForSelector(byTestId('onboarding-skills-selection'))
  for (const slug of userData.skills) {
    await clickElementByTestId(page, `user-chip-form--${slug}-chip`)
  }
  await clickElementByTestId(page, 'onboarding-stepper-nav-buttons-next-btn')

  // Expect account creation step
  await page.waitForSelector(byTestId('onboarding-account-creation'))
}

export const registerUser = async (
  context: BrowserContext,
  page: Page,
  {
    email,
    password,
    userData,
  }: {
    email: string
    password: string
    userData?: OnboardingUserData
  }
): Promise<void> => {
  await prepareForLoginOrRegistration(context, page)

  await clickElementByTestId(page, 'btn-to-registration-form')
  await waitForAnimationEnd(page, byTestId('onboarding-stepper'))

  if (userData) {
    await fillOutOnboarding(page, userData)
  } else {
    await skipOnboardingInitialSteps(page)
  }

  const emailInput = await locateElementByTestId(page, 'ory-traits-email-input')
  const passwordInput = await locateElementByTestId(page, 'ory-password-input')

  await expect(async () => {
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  }).toPass()

  await emailInput.fill(email)
  await passwordInput.fill(password)

  await clickElementByTestId(page, 'ory-submit-password')
}

const finishAccountSetup = async (
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
  const firstNameInput = await locateElementByTestId(page, 'onboarding-name-selection-first-name-input')
  await firstNameInput.fill(firstName)

  const lastNameInput = await locateElementByTestId(page, 'onboarding-name-selection-last-name-input')
  await lastNameInput.fill(lastName)
  // submit
  await clickElementByTestId(page, 'onboarding-name-selection-btn-submit')

  return {
    fullName: firstName + ' ' + lastName,
  }
}

export const proceedAsGuest = async (page: Page): Promise<void> => {
  //Introduced exception handling if first attempt to hit the server does not succeed
  await gotoWithRetries(page, '/')

  await denyConsent(page)

  await skipOnboardingInitialSteps(page)

  await clickElementByTestId(page, 'onboarding-account-creation-btn-continue-as-guest')

  await page.waitForSelector(byTestId('onboarding-account-creation-btn-continue-as-guest'), { state: 'detached' })

  // User will land on act screen after onboarding > navigate to home feed
  await clickElementByTestId(page, 'btn-to-home-view')
}

export const loginAsE2EUser = async (context: BrowserContext, page: Page): Promise<void> => {
  test.expect(!!process.env.E2E_USER_USERNAME, 'Env E2E_USER_USERNAME is set up correctly').toBeTruthy()
  test.expect(!!process.env.E2E_USER_PASSWORD, 'Env E2E_USER_PASSWORD is set up correctly').toBeTruthy()
  await login(context, page, process.env.E2E_USER_USERNAME as string, process.env.E2E_USER_PASSWORD as string)

  await page.waitForSelector(byTestId('home-feed-listing'))
}

const registerNewUserAccount = async (
  context: BrowserContext,
  page: Page,
  {
    email,
    password,
    userData,
    expectedScreen = 'act-home',
  }: {
    email?: string
    password?: string
    userData?: OnboardingUserData
    expectedScreen?: string
  } = {}
): Promise<{ fullName: string }> => {
  const emailToUse = email || newUserEmail()
  const passwordToUse = password || newUserPassword
  const newAccount = await registerUserAccount(context, page, {
    email: emailToUse,
    password: passwordToUse,
    userData,
  })
  await page.waitForSelector(byTestId('community-guidelines-modal-btn-submit'))
  await clickElementByTestId(page, 'community-guidelines-modal-btn-submit')
  // wait for expected screen (usually act home) - registration succeeded
  await page.waitForSelector(byTestId(expectedScreen))
  return newAccount
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

export const withRandomUserSession = async (
  browser: Browser,
  actions: (page: Page, userFullName: string) => Promise<void>,
  {
    email = newUserEmail(),
    password = randomPassword(),
    userData,
    expectedScreen,
  }: {
    email?: string
    password?: string
    userData?: OnboardingUserData
    expectedScreen?: string
  } = {}
): Promise<() => Promise<void>> => {
  const context = await browser.newContext()
  const page = await context.newPage()

  const newAccount = await registerNewUserAccount(context, page, { email, password, userData, expectedScreen })

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

export const isRunningLocally = () => {
  return process.env.BASE_URL === 'http://localhost:3000'
}
