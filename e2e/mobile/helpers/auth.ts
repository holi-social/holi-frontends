import { faker } from '@faker-js/faker'

import { navigateBackToHomeScreen, waitForHomeScreen } from '../helpers/navigation'
import {
  checkIfElementWithTestIdExists,
  fillFieldByTestId,
  tapOnElement,
  tapOnElementWithTestId,
  waitForAnyElementWithTestId,
  waitForElementWithTestId,
} from './selectors'
import { delayMs } from './time'

type AuthMode = 'login' | 'registration'

type DefaultAuthStepsProps = {
  email?: string
  password?: string
}

export const defaultPassword = 'TheSamePassword4A11E2eUsers'

export const registerNewUser = async (): Promise<string> => {
  const email = `${faker.internet.userName()}${faker.string.numeric(4)}@e2etest.com`
  await defaultAuthSteps({ email, password: defaultPassword }, 'registration')
  return email
}

export const loginNewUser = async (email: string) => {
  await defaultAuthSteps({ email, password: defaultPassword }, 'login')
}

export const defaultAuthSteps = async (
  {
    email = process.env.E2E_USER_USERNAME || 'empty',
    password = process.env.E2E_USER_PASSWORD || 'empty',
  }: DefaultAuthStepsProps = {},
  mode: AuthMode = 'login',
  withAccountSetup = true
) => {
  const isLogin = mode === 'login'

  // open user profile
  await tapOnElementWithTestId('btn-to-profile-view', 10000)
  if (isLogin) {
    await tapOnElementWithTestId('anonymous-profile-login-btn')
  } else {
    await tapOnElementWithTestId('btn-to-registration-form')
  }

  // inspect login modal
  await waitForElementWithTestId(isLogin ? 'ory-identifier-input' : 'ory-traits-email-input')
  await fillFieldByTestId(isLogin ? 'ory-identifier-input' : 'ory-traits-email-input', email)
  await fillFieldByTestId('ory-password-input', password)

  // Submit the form
  await tapOnElementWithTestId('ory-submit-password')

  if (!isLogin && withAccountSetup) {
    await finishAccountSetup()
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

export const skipOnboardingIfNecessary = async (timeout?: number) => {
  try {
    // Skip through all onboarding steps and continue as guest
    const onboardingButton = await waitForElementWithTestId('btn-to-onboarding', timeout)
    await tapOnElement(onboardingButton)
    await tapOnElementWithTestId('onboarding-stepper-progress-bar-skip-btn')
    // Wait for each screen to prevent pressing the same button twice
    await waitForElementWithTestId('onboarding-location-selection')
    await tapOnElementWithTestId('onboarding-stepper-progress-bar-skip-btn')
    await waitForElementWithTestId('onboarding-interests-selection')
    await tapOnElementWithTestId('onboarding-stepper-progress-bar-skip-btn')
    await waitForElementWithTestId('onboarding-skills-selection')
    await tapOnElementWithTestId('onboarding-stepper-progress-bar-skip-btn')
    await tapOnElementWithTestId('onboarding-account-creation-btn-continue-as-guest')
    await waitForHomeScreen(timeout)
  } catch (e) {
    // Assume onboarding is not necessary as button was not found
  }
}
const logoutOrDelete = async (fn: () => Promise<void>) => {
  if (await navigateToSettings()) {
    await fn()
    await tapOnElementWithTestId('btn-consentModal-declineAll')
    await tapOnElementWithTestId('toast-logout-success')
    await tapOnElementWithTestId('btn-to-home-view')
    await skipOnboardingIfNecessary()
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
