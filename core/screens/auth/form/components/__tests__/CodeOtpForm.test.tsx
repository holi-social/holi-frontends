import React from 'react'
import { CodeOtpForm } from '@holi/core/screens/auth/form/components/CodeOtpForm'
import { render, screen, userEvent } from '@testing-library/react-native'

describe('CodeOtpForm', () => {
  it('should render email and button to change it', () => {
    render(
      <CodeOtpForm
        email="ada@lovelace.com"
        onChangeEmail={jest.fn()}
        setCode={jest.fn()}
        onSubmit={jest.fn()}
        trackingScreen="mainLogin"
      />
    )

    expect(screen.getByText('ada@lovelace.com')).toBeOnTheScreen()
    expect(screen.getByLabelText('global.edit')).toBeOnTheScreen()
  })

  it('should call callback to change email', async () => {
    const onChangeEmail = jest.fn()
    const user = userEvent.setup()
    render(
      <CodeOtpForm
        email="ada@lovelace.com"
        onChangeEmail={onChangeEmail}
        setCode={jest.fn()}
        onSubmit={jest.fn()}
        trackingScreen="mainLogin"
      />
    )

    await user.press(screen.getByLabelText('global.edit'))

    expect(onChangeEmail).toHaveBeenCalled()
  })

  it('should render code input field and button to submit', () => {
    render(
      <CodeOtpForm onChangeEmail={jest.fn()} setCode={jest.fn()} onSubmit={jest.fn()} trackingScreen="mainLogin" />
    )

    expect(screen.getByLabelText('auth.login.input.label-SignInCode')).toBeOnTheScreen()
    expect(screen.getByLabelText('auth.login.cta.verifyEmail')).toBeOnTheScreen()
  })

  it('should control code input', async () => {
    const user = userEvent.setup()
    const setCode = jest.fn()
    render(
      <CodeOtpForm
        onChangeEmail={jest.fn()}
        code="123"
        setCode={setCode}
        codeValidationError="invalid code"
        onSubmit={jest.fn()}
        trackingScreen="mainLogin"
      />
    )

    const codeInput = screen.getByLabelText('auth.login.input.label-SignInCode')

    expect(codeInput.props.value).toEqual('123')
    expect(screen.getByText('invalid code')).toBeOnTheScreen()

    await user.type(codeInput, '4')

    expect(setCode).toHaveBeenCalledWith('1234')
  })

  it('should submit the form on enter in code input field', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const setCode = jest.fn()
    render(
      <CodeOtpForm
        onChangeEmail={jest.fn()}
        code="123"
        setCode={setCode}
        onSubmit={onSubmit}
        trackingScreen="mainLogin"
      />
    )

    await user.type(screen.getByLabelText('auth.login.input.label-SignInCode'), '4{Enter}')

    expect(setCode).toHaveBeenCalledWith('1234')
    expect(onSubmit).toHaveBeenCalledWith('code')
  })

  it('should submit the form on button press', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    render(<CodeOtpForm onChangeEmail={jest.fn()} setCode={jest.fn()} onSubmit={onSubmit} trackingScreen="mainLogin" />)

    await user.press(screen.getByLabelText('auth.login.cta.verifyEmail'))

    expect(onSubmit).toHaveBeenCalledWith('code')
  })

  it('should not submit the form on button press if the button is disabled', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    render(
      <CodeOtpForm
        onChangeEmail={jest.fn()}
        setCode={jest.fn()}
        onSubmit={onSubmit}
        submitDisabled
        trackingScreen="mainLogin"
      />
    )

    const button = screen.getByLabelText('auth.login.cta.verifyEmail')

    await user.press(button)

    expect(button).toBeDisabled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should render text and button to resend code', () => {
    render(
      <CodeOtpForm onChangeEmail={jest.fn()} setCode={jest.fn()} onSubmit={jest.fn()} trackingScreen="mainLogin" />
    )

    expect(screen.getByText('registration.emailVerification.resendInstruction')).toBeOnTheScreen()
    expect(screen.getByLabelText('registration.emailVerification.resendEmail')).toBeOnTheScreen()
  })

  it('should call callback to resend code', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    render(<CodeOtpForm onChangeEmail={jest.fn()} setCode={jest.fn()} onSubmit={onSubmit} trackingScreen="mainLogin" />)

    await user.press(screen.getByLabelText('registration.emailVerification.resendEmail'))

    expect(onSubmit).toHaveBeenCalledWith('resend')
  })

  it('should call not resend the code if the button is disabled', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    render(
      <CodeOtpForm
        onChangeEmail={jest.fn()}
        setCode={jest.fn()}
        onSubmit={onSubmit}
        submitDisabled
        trackingScreen="mainLogin"
      />
    )

    const button = screen.getByLabelText('registration.emailVerification.resendEmail')

    await user.press(button)

    expect(button).toBeDisabled()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
