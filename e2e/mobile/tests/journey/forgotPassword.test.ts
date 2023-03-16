import {
  checkIfElementWithTestIdExists,
  fillFieldByTestId,
  tapOnElementWithTestId,
  tapOnLoginLinkInText,
  waitForElementWithTestId,
  waitForElementWithTestIdToBeNull,
} from '../../helpers/selectors'

const submitForm = async () => {
  // workaround: click submit button twice:
  // the 1st one closes the keyboard
  await tapOnElementWithTestId('ory-submit-link')
  // the 2nd one submits the form.
  if (await checkIfElementWithTestIdExists('ory-submit-link', 1000)) {
    await tapOnElementWithTestId('ory-submit-link')
  }
}

describe('@ForgotPassword', () => {
  // fails on ios: Couldn't tap on element with testID: ory-submit-password
  it('validates and submits the form', async () => {
    await tapOnElementWithTestId('btn-to-profile-view', 10000)
    await tapOnLoginLinkInText()
    await tapOnElementWithTestId('ory-submit-password') // close keyboard
    await tapOnElementWithTestId('btn-to-forgot-password-form')

    // shows also login and registration link
    await tapOnElementWithTestId('ory-submit-link') // close keyboard
    await checkIfElementWithTestIdExists('already-have-account-text')
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
    await waitForElementWithTestIdToBeNull('ory-email-input', 3000)

    // go back home
    await tapOnElementWithTestId('back-to-home-btn')

    // close forgotPassword modal
    // await tapOnElementWithTestId('nav-button-back')
    // close login modal
    // await tapOnElementWithTestId('nav-button-back')
    // await tapOnElementWithTestId('btn-to-home-view')
  })
})
