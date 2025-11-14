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

export const testIdContinueAsGuest = 'nav-button-back'

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
    await tapOnElementWithTestId('btn-to-onboarding')
    // Skip onboarding by closing the modal
    await tapOnElementWithTestId('nav-button-back')
    // User will land on home screen after onboarding
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

  await tapOnElementWithTestId('btn-to-email-password-form')

  // Fill out login form
  await waitForElementWithTestId('email-input')
  await fillFieldByTestId('email-input', email)
  await fillFieldByTestId('password-input', password)

  // Close the keyboard by clicking on the header
  await tapOnElementWithTestId('heading')

  // Submit the form
  await tapOnElementWithTestId('submit-password')

  if (expectHomeScreen) {
    await waitForHomeScreen()
  }
}

export const register = async ({
  email = process.env.E2E_USER_USERNAME || 'empty',
  password = process.env.E2E_USER_PASSWORD || 'empty',
}: AuthProps = {}) => {
  if (await checkIfElementWithTestIdExists('btn-to-onboarding', 1000)) {
    await fillOutOnboarding()
  } else {
    // Register from anonymous profile screen
    await tapOnElementWithTestId('btn-to-anonymous-profile-view', 10000)
    await tapOnElementWithTestId('btn-to-registration-form')
  }

  // Register as new user
  await tapOnElementWithTestId('btn-to-email-password-form')
  await waitForElementWithTestId('ory-traits-email-input')
  await fillFieldByTestId('ory-traits-email-input', email)
  await fillFieldByTestId('ory-password-input', password)

  // Close the keyboard by clicking on the header
  await tapOnElementWithTestId('create-account-logo')

  // Submit the form
  await tapOnElementWithTestId('ory-submit-password')
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

  delayMs(10000)
}

const fillOutOnboarding = async () => {
  const onboardingButton = await waitForElementWithTestId('btn-to-onboarding')
  await tapOnElement(onboardingButton)

  await waitForElementWithTestId('btn-to-email-password-form')
}

const logoutOrDelete = async (fn: () => Promise<void>, skipNavigationToHome = false) => {
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
    if (!skipNavigationToHome) {
      await tapOnElementWithTestId('btn-to-home-view')
    }
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
  }, true)
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
