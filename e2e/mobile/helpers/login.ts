import { fillFieldByTestId, tapOnElementWithTestId, waitForElementWithTestId } from './selectors'

type DefaultLoginStepsProps = {
  username?: string
  password?: string
}

export const defaultLoginSteps = async ({ username, password }: DefaultLoginStepsProps = {}) => {
  // open user profile
  await tapOnElementWithTestId('btn-to-profile-view')

  // hit login
  await tapOnElementWithTestId('btn-to-login-form')

  // inspect login modal
  await waitForElementWithTestId('ory-input-identifier-input')

  await fillFieldByTestId('ory-input-identifier-input', username || process.env.E2E_USER_USERNAME || 'empty')
  await fillFieldByTestId('ory-input-password-input', password || process.env.E2E_USER_PASSWORD || 'empty')

  // close keyboard
  // https://webdriver.io/docs/api/appium#hidekeyboard
  // TODO: FIXME: does not work await Appium.hideKeyboard('tapOutside')

  await waitForElementWithTestId('ory-submit-method')

  await tapOnElementWithTestId('ory-submit-method')
  // the 1st one closes the keyboard
  // the 2nd one submits the form.
  await tapOnElementWithTestId('ory-submit-method')
}
