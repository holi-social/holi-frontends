import { faker } from '@faker-js/faker'

import { navigateBackToHomeScreen, waitForHomeScreen } from '../helpers/navigation'
import {
  checkIfElementWithTestIdExists,
  fillFieldByTestId,
  tapOnElement,
  tapOnElementWithTestId,
  tapOnLoginLinkInText,
  waitForAnyElementWithTestId,
  waitForElementWithTestId,
} from './selectors'
import { delayMs } from './time'

type AuthProps = {
  email?: string
  password?: string
}

export const defaultPassword = 'TheSamePassword4A11E2eUsers'

export const testIdContinueAsGuest = 'onboarding-account-creation-btn-continue-as-guest'

export const registerNewUser = async (): Promise<string> => {
  const email = `${faker.internet.userName()}${faker.string.numeric(4)}@e2etest.com`
  await register({ email, password: defaultPassword })
  return email
}

export const loginNewUser = async (email: string) => {
  await login({ email, password: defaultPassword })
}

export const continueAsGuest = async () => {
  if (await checkIfElementWithTestIdExists('btn-to-onboarding')) {
    // Skip through all onboarding steps and continue as guet
    await skipOnboardingSteps()
    await tapOnElementWithTestId(testIdContinueAsGuest)
  }

  await waitForHomeScreen()
}

export const login = async (
  {
    email = process.env.E2E_USER_USERNAME || 'empty',
    password = process.env.E2E_USER_PASSWORD || 'empty',
  }: AuthProps = {},
  expectHomeScreen = true
) => {
  if (await checkIfElementWithTestIdExists('btn-to-onboarding', 1000)) {
    // Press login link on welcome screen
    await tapOnLoginLinkInText()
  } else {
    // Login from anonymous profile screen
    await tapOnElementWithTestId('btn-to-anonymous-profile-view', 10000)
    await tapOnElementWithTestId('anonymous-profile-login-btn')
  }

  // Fill out login form
  await waitForElementWithTestId('ory-identifier-input')
  await fillFieldByTestId('ory-identifier-input', email)
  await fillFieldByTestId('ory-password-input', password)

  // Submit the form
  await tapOnElementWithTestId('ory-submit-password')

  if (expectHomeScreen) {
    await waitForHomeScreen()
  }
}

export const register = async (
  {
    email = process.env.E2E_USER_USERNAME || 'empty',
    password = process.env.E2E_USER_PASSWORD || 'empty',
  }: AuthProps = {},
  withAccountSetup = true
) => {
  if (await checkIfElementWithTestIdExists('btn-to-onboarding', 1000)) {
    // Skip onboarding steps
    await skipOnboardingSteps()
  } else {
    // Register from anonymous profile screen
    await tapOnElementWithTestId('btn-to-anonymous-profile-view', 10000)
    await tapOnElementWithTestId('btn-to-registration-form')
  }

  // Register as new user
  await waitForElementWithTestId('ory-traits-email-input')
  await fillFieldByTestId('ory-traits-email-input', email)
  await fillFieldByTestId('ory-password-input', password)

  // Submit the form
  await tapOnElementWithTestId('ory-submit-password')

  // Finish account setup
  if (withAccountSetup) {
    await finishAccountSetup()

    await waitForHomeScreen()
  }
}

export const finishAccountSetup = async ({
  firstName = faker.person.firstName(),
  lastName = faker.person.lastName(),
}: {
  firstName?: string
  lastName?: string
} = {}) => {
  // go through accound setup
  // Names step
  await waitForElementWithTestId('onboarding-name-selection')
  // provide user name
  await fillFieldByTestId('onboarding-name-selection-first-name-input', firstName)
  // provide user name
  await fillFieldByTestId('onboarding-name-selection-last-name-input', lastName)
  // submit name changes
  await tapOnElementWithTestId('onboarding-name-selection-btn-submit')

  // Agree to community guidelines
  await tapOnElementWithTestId('community-guidelines-modal-btn-submit')

  await waitForHomeScreen()
  delayMs(10000)
}

const skipOnboardingSteps = async () => {
  // Skip through all onboarding steps
  const onboardingButton = await waitForElementWithTestId('btn-to-onboarding')
  await tapOnElement(onboardingButton)
  await tapOnElementWithTestId('onboarding-stepper-progress-bar-skip-btn')
  // Wait for each screen to prevent pressing the same button twice
  await waitForElementWithTestId('onboarding-location-selection')
  await tapOnElementWithTestId('onboarding-stepper-progress-bar-skip-btn')
  await waitForElementWithTestId('onboarding-interests-selection')
  await tapOnElementWithTestId('onboarding-stepper-progress-bar-skip-btn')
  await waitForElementWithTestId('onboarding-skills-selection')
  await tapOnElementWithTestId('onboarding-stepper-progress-bar-skip-btn')
}

const logoutOrDelete = async (fn: () => Promise<void>) => {
  if (
    (await checkIfElementWithTestIdExists('btn-to-onboarding')) ||
    (await checkIfElementWithTestIdExists('btn-to-anonymous-profile-view'))
  ) {
    // Already logged out, nothing to do
    return
  }
  if (await navigateToSettings()) {
    await fn()
    await tapOnElementWithTestId('btn-consentModal-declineAll')
    await tapOnElementWithTestId('toast-logout-success')
    await tapOnElementWithTestId('btn-to-home-view')
  }
}

export const logout = async () => {
  await logoutOrDelete(async () => {
    await tapOnElementWithTestId('btn-to-logout')
    await tapOnElementWithTestId('modal-logout-confirmation-primary')
  })
}

export const deleteAccount = async () => {
  await logoutOrDelete(async () => {
    await tapOnElementWithTestId('btn-your-account')
    await tapOnElementWithTestId('btn-delete-account')
    await tapOnElementWithTestId('account-deletion-confirmation-confirmation-primary')
  })
}

const navigateToSettings = async () => {
  if (await checkIfElementWithTestIdExists('btn-to-logout')) {
    return true
  }
  if (await checkIfElementWithTestIdExists('btn-to-settings')) {
    await tapOnElementWithTestId('btn-to-settings')
    await waitForElementWithTestId('btn-to-logout')
    return true
  }
  if (await checkIfElementWithTestIdExists('btn-to-profile-view')) {
    return await navigateViaProfileToSettings()
  }
  await navigateBackToHomeScreen()
  return await navigateViaProfileToSettings()
}

const navigateViaProfileToSettings = async () => {
  await tapOnElementWithTestId('btn-to-profile-view')
  const found = await waitForAnyElementWithTestId(['btn-to-settings', 'btn-to-registration-form'])
  if (found.testId == 'btn-to-settings') {
    await tapOnElementWithTestId('btn-to-settings')
    await waitForElementWithTestId('btn-to-logout')
    return true
  }
  return false
}
