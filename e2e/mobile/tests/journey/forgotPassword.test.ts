import {
  checkIfElementWithTestIdExists,
  fillFieldByTestId,
  tapOnElementWithTestId,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../../helpers/selectors'

const submitForm = async () => {
  await waitForElementWithTestId('ory-submit-method')
  // workaround: click submit button twice:
  // the 1st one closes the keyboard
  await tapOnElementWithTestId('ory-submit-method')
  // the 2nd one submits the form.
  await tapOnElementWithTestId('ory-submit-method')
}

describe('@ForgotPassword', () => {
  it('validates and submits the form', async () => {
    await tapOnElementWithTestId('btn-to-profile-view', 10000)
    await checkIfElementWithTestIdExists('btn-to-login-form')
    await tapOnElementWithTestId('btn-to-login-form')
    await tapOnElementWithTestId('ory-submit-method') // close keyboard
    await waitForElementWithTestId('btn-to-forgot-password-form')
    await tapOnElementWithTestId('btn-to-forgot-password-form')

    // shows also login and registration link
    await tapOnElementWithTestId('ory-submit-method') // close keyboard
    await checkIfElementWithTestIdExists('btn-to-login-form')
    await checkIfElementWithTestIdExists('btn-to-registration-form')

    // validation message on invalid form
    await waitForElementWithTestId('ory-email-input')
    await fillFieldByTestId('ory-email-input', 'an-invalid-email')
    await submitForm()
    await waitForElementWithTestId('ory-email-input-error-message')

    // valid email input and submission
    await fillFieldByTestId('ory-email-input', 'valid@mail.de')
    await submitForm()

    // success view
    await waitForElementWithTestId('form-sent-headline')
    await waitForElementWithTestId('back-to-home-btn')
    await waitForElementWithTestIdToBeNull('ory-email-input')

    // go back home
    await tapOnElementWithTestId('back-to-home-btn')

    // close forgotPassword modal
    // await tapOnElementWithTestId('nav-button-back')
    // close login modal
    // await tapOnElementWithTestId('nav-button-back')
    // await tapOnElementWithTestId('btn-to-home-view')
  })
})
