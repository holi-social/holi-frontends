import {
  checkIfElementWithTestIdExists,
  fillFieldByTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
} from './selectors'

type AuthMode = 'login' | 'registration'

type DefaultAuthStepsProps = {
  email?: string
  password?: string
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
  const buttonId = isLogin ? 'btn-to-login-form' : 'btn-to-registration-form'
  const buttonExists = await checkIfElementWithTestIdExists(buttonId)
  if (!isLogin || buttonExists) {
    await tapOnElementWithTestId(buttonId)
  }

  // inspect login modal
  await waitForElementWithTestId(isLogin ? 'ory-identifier-input' : 'ory-traits-email-input')

  await fillFieldByTestId(isLogin ? 'ory-identifier-input' : 'ory-traits-email-input', email)
  await fillFieldByTestId('ory-password-input', password)

  // close keyboard by touching the submit button (outside of the keyboad)
  await tapOnElementWithTestId('ory-submit-method')

  if (!isLogin) {
    const consentCheckbox = await waitForElementWithTestId('ory-checkbox-traits_consent')
    consentCheckbox.click()
  }

  await tapOnElementWithTestId('ory-submit-method')
}

export const logout = async () => {
  // TODO: find quicker solution to check if logged in?
  const profileButtonExists = await checkIfElementWithTestIdExists('btn-to-profile-view')
  if (profileButtonExists) {
    await tapOnElementWithTestId('btn-to-profile-view')
  }

  const settingsButtonExists = await checkIfElementWithTestIdExists('btn-to-settings')
  if (settingsButtonExists) {
    await tapOnElementWithTestId('btn-to-settings')
  }

  const logoutButtonExists = await checkIfElementWithTestIdExists('btn-to-logout')
  if (logoutButtonExists) {
    await tapOnElementWithTestId('btn-to-logout')
    await waitForElementWithTestId('modal-logout-confirmation-confirm')
    await tapOnElementWithTestId('modal-logout-confirmation-confirm')
  }

  await waitForElementWithTestId('btn-to-home-view')
  await tapOnElementWithTestId('btn-to-home-view')
}
