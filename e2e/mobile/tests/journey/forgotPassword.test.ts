import { itif } from '../../helpers/platform'
import { tapOnElementWithTestId, waitForElementWithTestId } from '../../helpers/selectors'

describe('@ForgotPassword', () => {
  itif(platform === 'ios', 'validates and submits the form', async () => {
    await tapOnElementWithTestId('btn-to-anonymous-profile-view', 10000)
    await tapOnElementWithTestId('anonymous-profile-login-btn')
    await tapOnElementWithTestId('btn-to-forgot-password-form')

    await waitForElementWithTestId('web-view')
    await tapOnElementWithTestId('nav-button-back')

    // password reset is now handled in a web-view and can't be tested here.
    // // shows also login and registration link
    // await checkIfElementWithTestIdExists('already-have-account-text')
    // await checkIfElementWithTestIdExists('btn-to-registration-form')

    // // validation message on invalid form
    // await waitForElementWithTestId('ory-email-input')
    // await fillFieldByTestId('ory-email-input', 'an-invalid-email')
    // await tapOnElementWithTestId('ory-submit-code')
    // await waitForElementWithTestId('ory-email-input-error-message')

    // // valid email input and submission
    // await fillFieldByTestId('ory-email-input', 'valid@mail.de')
    // await tapOnElementWithTestId('ory-submit-code')

    // // success view
    // await waitForElementWithTestId('form-sent-headline')
    // await waitForElementWithTestId('nav-button-back')
    // await waitForElementWithTestIdToBeNull('ory-email-input', 3000)

    // // go back home
    // await tapOnElementWithTestId('nav-button-back')

    // close forgotPassword modal
    // await tapOnElementWithTestId('nav-button-back')
    // close login modal
    // await tapOnElementWithTestId('nav-button-back')
    // await tapOnElementWithTestId('btn-to-home-view')
  })
})
