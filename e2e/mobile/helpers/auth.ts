import { fillFieldByTestId, tapOnElementWithTestId, waitForElementWithTestId } from './selectors'

type DefaultAuthStepsProps = {
  email?: string
  password?: string
  mode?: 'login' | 'registration'
}

export const defaultAuthSteps = async (
  {
    email = process.env.E2E_USER_USERNAME || 'empty',
    password = process.env.E2E_USER_PASSWORD || 'empty',
  }: DefaultAuthStepsProps = {},
  mode: 'login' | 'registration' = 'login'
) => {
  const isLogin = mode === 'login'

  // open user profile
  await tapOnElementWithTestId('btn-to-profile-view')

  // hit login
  await tapOnElementWithTestId(isLogin ? 'btn-to-login-form' : 'btn-to-registration-form')

  // inspect login modal
  await waitForElementWithTestId(isLogin ? 'ory-identifier-input' : 'ory-traits-email-input')

  await fillFieldByTestId(isLogin ? 'ory-identifier-input' : 'ory-traits-email-input', email)
  await fillFieldByTestId('ory-password-input', password)

  // close keyboard
  // https://webdriver.io/docs/api/appium#hidekeyboard
  // TODO: FIXME: does not work await Appium.hideKeyboard('tapOutside')

  await waitForElementWithTestId('ory-submit-method')

  await tapOnElementWithTestId('ory-submit-method')
  // the 1st one closes the keyboard
  // the 2nd one submits the form.
  await tapOnElementWithTestId('ory-submit-method')
}
