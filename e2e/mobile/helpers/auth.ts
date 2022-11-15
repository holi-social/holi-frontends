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

  await waitForElementWithTestId('ory-submit-method')

  // close keyboard
  // https://webdriver.io/docs/api/appium#hidekeyboard
  // TODO: FIXME: does not work await Appium.hideKeyboard('tapOutside')
  // workaround: click submit button twice:
  // the 1st one closes the keyboard
  await tapOnElementWithTestId('ory-submit-method')
  // the 2nd one submits the form.
  await tapOnElementWithTestId('ory-submit-method')
}

export const logout = async () => {
  // TODO: find quicker solution to check if logged in?
  const profileButtonExists = await checkIfElementWithTestIdExists('btn-to-profile-view')
  if (profileButtonExists) {
    await tapOnElementWithTestId('btn-to-profile-view')
  }

  const logoutButtonExists = await checkIfElementWithTestIdExists('btn-to-logout')
  if (logoutButtonExists) {
    await tapOnElementWithTestId('btn-to-logout')
    await waitForElementWithTestId('confirm-logout-button')
    await tapOnElementWithTestId('confirm-logout-button')
  }

  await waitForElementWithTestId('btn-to-home-view')
  await tapOnElementWithTestId('btn-to-home-view')
}
