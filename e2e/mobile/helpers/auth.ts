import { faker } from '@faker-js/faker'

import { navigateBackToHomeScreen } from '../helpers/navigation'
import {
  checkIfElementWithTestIdExists,
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
  const email = `${faker.internet.userName()}${faker.random.numeric(4)}@e2etest.com`
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
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  pronouns = '',
}: {
  firstName?: string
  lastName?: string
  pronouns?: string
} = {}) => {
  // go through accound setup
  // Names step
  await waitForElementWithTestId('account-setup-names-step')
  // provide user name
  await fillFieldByTestId('first-name-input', firstName)
  // provide user name
  await fillFieldByTestId('last-name-input', lastName)
  // provide user name
  await fillFieldByTestId('pronouns-input', pronouns)
  // submit name changes
  // tap headline to hide keyboard
  await tapOnElementWithTestId('account-setup-names-step-headline')
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
}

export const logout = async () => {
  // TODO: find quicker solution to check if logged in?
  await gotoProfileSettingsOrLogin()

  if (await checkIfElementWithTestIdExists('btn-to-logout')) {
    await tapOnElementWithTestId('btn-to-logout')
    await tapOnElementWithTestId('modal-logout-confirmation-confirm')
  }

  await tapOnElementWithTestId('btn-to-home-view')
}

export const deleteAccount = async () => {
  await gotoProfileSettingsOrLogin()

  await tapOnElementWithTestId('btn-your-account')
  await tapOnElementWithTestId('btn-delete-account')
  await tapOnElementWithTestId('account-deletion-confirmation-confirmation-confirm')

  await waitForElementWithTestId('already-have-account-text')
  await tapOnElementWithTestId('btn-to-home-view')
}

const gotoProfileSettingsOrLogin = async () => {
  if (await checkIfElementWithTestIdExists('btn-to-logout')) {
    return
  }
  if (await checkIfElementWithTestIdExists('btn-to-settings')) {
    await tapOnElementWithTestId('btn-to-settings')
    await waitForElementWithTestId('btn-to-logout')
    return
  }
  if (await checkIfElementWithTestIdExists('btn-to-profile-view')) {
    await tapOnElementWithTestId('btn-to-profile-view')
    await waitForAnyElementWithTestId(['already-have-account-text', 'btn-to-settings'])
    if (await checkIfElementWithTestIdExists('btn-to-settings')) {
      await tapOnElementWithTestId('btn-to-settings')
      await waitForElementWithTestId('btn-to-logout')
    }
    return
  }
  await navigateBackToHomeScreen()
  await tapOnElementWithTestId('btn-to-profile-view')
  await waitForAnyElementWithTestId(['already-have-account-text', 'btn-to-settings'])
  if (await checkIfElementWithTestIdExists('btn-to-settings')) {
    await tapOnElementWithTestId('btn-to-settings')
    await waitForElementWithTestId('btn-to-logout')
  }
}
