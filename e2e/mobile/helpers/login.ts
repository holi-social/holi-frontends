import { fillFieldByTestId, tapOnElementWithTestId } from './selectors'

type DefaultLoginStepsProps = {
  username?: string
  password?: string
}

export const defaultLoginSteps = async ({ username, password }: DefaultLoginStepsProps = {}) => {
  await tapOnElementWithTestId('btn-to-profile-view')
  await tapOnElementWithTestId('btn-to-login-form')

  await fillFieldByTestId('ory-input-identifier-input', username || process.env.E2E_USER_USERNAME || 'empty')
  await fillFieldByTestId('ory-input-password-input', password || process.env.E2E_USER_PASSWORD || 'empty')

  // https://webdriver.io/docs/api/appium#hidekeyboard
  await Appium.hideKeyboard('tapOutside')
  await tapOnElementWithTestId('ory-submit-method')
  // TODO(SF) why twice??
  await tapOnElementWithTestId('ory-submit-method')
}
