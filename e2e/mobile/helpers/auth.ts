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
  mode: AuthMode = 'login'
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
    await tapOnElementWithTestId('holi-wizard-next-btn')
    await tapOnElementWithTestId('privicy-policy-checkbox')
    await tapOnElementWithTestId('holi-wizard-next-btn')
  }

  // inspect login modal
  await waitForElementWithTestId(isLogin ? 'ory-identifier-input' : 'ory-traits-email-input')
  await fillFieldByTestId(isLogin ? 'ory-identifier-input' : 'ory-traits-email-input', email)
  await fillFieldByTestId('ory-password-input', password)

  // close keyboard by touching the submit button (outside of the keyboad)
  await tapOnElementWithTestId('ory-submit-password')

  // Submit the form
  await tapOnElementWithTestId('ory-submit-password')
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
