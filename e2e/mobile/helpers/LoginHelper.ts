import Helper from '@codeceptjs/helper'

type DefaultLoginStepsProps = {
  username?: string
  password?: string
}

class LoginHelper extends Helper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(config: any) {
    super(config)
  }

  async defaultLoginSteps({ username, password }: DefaultLoginStepsProps) {
    const { Appium, SelectorHelper } = this.helpers

    await SelectorHelper.tapOnElementWithTestId('btn-to-profile-view')
    await SelectorHelper.tapOnElementWithTestId('btn-to-login-form')

    await SelectorHelper.fillFieldByTestId(
      'ory-input-identifier-input',
      username || process.env.E2E_USER_USERNAME || 'empty'
    )
    await SelectorHelper.fillFieldByTestId(
      'ory-input-password-input',
      password || process.env.E2E_USER_PASSWORD || 'empty'
    )

    await Appium.hideDeviceKeyboard('tapOutside')
    await SelectorHelper.tapOnElementWithTestId('ory-submit-method')
  }
}

export = LoginHelper
