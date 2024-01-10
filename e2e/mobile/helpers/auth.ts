import { faker } from '@faker-js/faker'

import { delay } from '@holi/e2e-mobile/helpers/time'

import { navigateBackToHomeScreen, waitForHomeScreen } from '../helpers/navigation'
import {
  elementExists,
  fillFieldByTestId,
  tapOnElementWithTestId,
  tapOnLoginLinkInText,
  waitForAnyElementWithTestId,
  waitForElementWithTestId,
} from './selectors'

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

  // hit login
  const buttonId = isLogin ? 'already-have-account-text' : 'btn-to-registration-form'
  if (isLogin) {
    await tapOnLoginLinkInText()
  } else {
    await tapOnElementWithTestId(buttonId)
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
  await tapOnElementWithTestId('holi-wizard-next-btn')

  // Pre-success step
  await waitForElementWithTestId('account-setup-pre-registration-success-step')
  await tapOnElementWithTestId('holi-wizard-next-btn')
  // Interests step
  await waitForElementWithTestId('account-setup-interests-step')
  await tapOnElementWithTestId('holi-wizard-skip-btn')
  // Location step
  await waitForElementWithTestId('account-setup-location-step')
  await tapOnElementWithTestId('holi-wizard-skip-btn')
  // Success step
  await waitForElementWithTestId('account-setup-success-step')
  await tapOnElementWithTestId('holi-wizard-next-btn')

  await waitForHomeScreen()
}

export const logout = async () => {
  if (await navigateToSettings()) {
    await tapOnElementWithTestId('btn-to-logout')
    // wait for animation of confirm modal
    await delay(2)
    await tapOnElementWithTestId('modal-logout-confirmation-confirm')
    await waitForElementWithTestId('already-have-account-text', 15000)
  }

  await tapOnElementWithTestId('btn-to-home-view')
}

export const deleteAccount = async () => {
  if (await navigateToSettings()) {
    await tapOnElementWithTestId('btn-your-account')
    await tapOnElementWithTestId('btn-delete-account')
    await tapOnElementWithTestId('account-deletion-confirmation-confirmation-confirm')
    await waitForElementWithTestId('already-have-account-text', 15000)
  }

  await tapOnElementWithTestId('btn-to-home-view')
}

const navigateToSettings = async () => {
  // are we at settings already?
  if (await elementExists('btn-to-logout')) {
    return true
  }

  // go to settings when navigation is possible
  if (await elementExists('btn-to-settings')) {
    await tapOnElementWithTestId('btn-to-settings')
    await waitForElementWithTestId('btn-to-logout')
    return true
  }

  // we are in profile and need to go back
  if (await elementExists('btn-to-profile-view')) {
    await tapOnElementWithTestId('btn-to-profile-view')
    await eitherAtProfileOrLogin()
    if (await elementExists('btn-to-settings')) {
      await tapOnElementWithTestId('btn-to-settings')
      await waitForElementWithTestId('btn-to-logout')
      return true
    }
    return false
  }

  // we are somewhere else and try to get back to home screen
  await navigateBackToHomeScreen()

  // go to settings again
  if (await elementExists('btn-to-profile-view')) {
    await tapOnElementWithTestId('btn-to-profile-view')
    await eitherAtProfileOrLogin()
    if (await elementExists('btn-to-settings')) {
      await tapOnElementWithTestId('btn-to-settings')
      await waitForElementWithTestId('btn-to-logout')
      return true
    }
    return false
  }

  // no route to settings
  // eslint-disable-next-line no-console
  console.error('Error while navigating to settings')
  return false
}

const eitherAtProfileOrLogin = async () => {
  await waitForAnyElementWithTestId(['already-have-account-text', 'btn-to-settings'])
}
