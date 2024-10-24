import { faker } from '@faker-js/faker'

import { navigateBackToHomeScreen, waitForHomeScreen } from '../helpers/navigation'
import {
  checkIfElementWithTestIdExists,
  fillFieldByTestId,
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
    await tapOnElementWithTestId('community-guidelines-checkbox')
    await tapOnElementWithTestId('community-guidelines-navbtn-next-btn')
    await tapOnElementWithTestId('privacy-policy-checkbox')
    await tapOnElementWithTestId('privacy-policy-navbtn-next-btn')
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
  await waitForElementWithTestId('account-setup-names-step')
  // provide user name
  await fillFieldByTestId('first-name-input', firstName)
  // provide user name
  await fillFieldByTestId('last-name-input', lastName)
  // submit name changes
  await tapOnElementWithTestId('holi-wizard-save-btn')

  // Pre-success step
  await waitForElementWithTestId('account-setup-pre-registration-success-step')
  await tapOnElementWithTestId('holi-wizard-save-btn')
  // Interests step
  await waitForElementWithTestId('account-setup-interests-step')
  await tapOnElementWithTestId('holi-wizard-skip-btn')
  // Location step
  await waitForElementWithTestId('account-setup-location-step')
  await tapOnElementWithTestId('holi-wizard-skip-btn')
  // Success step
  await waitForElementWithTestId('account-setup-success-step')
  await tapOnElementWithTestId('holi-wizard-save-btn')

  await waitForHomeScreen()
  delayMs(10000)
}

const logoutOrDelete = async (fn: () => Promise<void>) => {
  if (await navigateToSettings()) {
    await fn()
    await tapOnElementWithTestId('btn-consentModal-declineAll')
    await tapOnElementWithTestId('toast-logout-success')
    await tapOnElementWithTestId('btn-to-home-view')
    await tapOnElementWithTestId('btn-to-onboarding')
    await tapOnElementWithTestId('holi-wizard-skip-btn')
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
