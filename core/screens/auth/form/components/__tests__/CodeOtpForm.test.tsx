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
        onResend={jest.fn()}
      />
    )

    expect(screen.getByText('ada@lovelace.com'))
    expect(screen.getByLabelText('global.edit'))
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
        onResend={jest.fn()}
      />
    )

    await user.press(screen.getByLabelText('global.edit'))

    expect(onChangeEmail).toHaveBeenCalled()
  })

  it('should render code input field and button to submit', () => {
    render(<CodeOtpForm onChangeEmail={jest.fn()} setCode={jest.fn()} onSubmit={jest.fn()} onResend={jest.fn()} />)

    expect(screen.getByLabelText('auth.login.input.label-SignInCode'))
    expect(screen.getByLabelText('auth.login.cta.verifyEmail'))
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
        onResend={jest.fn()}
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
      <CodeOtpForm onChangeEmail={jest.fn()} code="123" setCode={setCode} onSubmit={onSubmit} onResend={jest.fn()} />
    )

    await user.type(screen.getByLabelText('auth.login.input.label-SignInCode'), '4{Enter}')

    expect(setCode).toHaveBeenCalledWith('1234')
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should submit the form on button press', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    render(<CodeOtpForm onChangeEmail={jest.fn()} setCode={jest.fn()} onSubmit={onSubmit} onResend={jest.fn()} />)

    await user.press(screen.getByLabelText('auth.login.cta.verifyEmail'))

    expect(onSubmit).toHaveBeenCalled()
  })

  it('should not submit the form on button press if the button is disabled', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    render(
      <CodeOtpForm
        onChangeEmail={jest.fn()}
        setCode={jest.fn()}
        onSubmit={onSubmit}
        onResend={jest.fn()}
        submitDisabled
      />
    )

    const button = screen.getByLabelText('auth.login.cta.verifyEmail')

    await user.press(button)

    expect(button).toBeDisabled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should render text and button to resend code', () => {
    render(<CodeOtpForm onChangeEmail={jest.fn()} setCode={jest.fn()} onSubmit={jest.fn()} onResend={jest.fn()} />)

    expect(screen.getByText('registration.emailVerification.resendInstruction'))
    expect(screen.getByLabelText('registration.emailVerification.resendEmail'))
  })

  it('should call callback to resend code', async () => {
    const user = userEvent.setup()
    const onResend = jest.fn()
    render(<CodeOtpForm onChangeEmail={jest.fn()} setCode={jest.fn()} onSubmit={jest.fn()} onResend={onResend} />)

    await user.press(screen.getByLabelText('registration.emailVerification.resendEmail'))

    expect(onResend).toHaveBeenCalled()
  })

  it('should call not resend the code if the button is disabled', async () => {
    const user = userEvent.setup()
    const onResend = jest.fn()
    render(
      <CodeOtpForm
        onChangeEmail={jest.fn()}
        setCode={jest.fn()}
        onSubmit={jest.fn()}
        onResend={onResend}
        submitDisabled
      />
    )

    const button = screen.getByLabelText('registration.emailVerification.resendEmail')

    await user.press(button)

    expect(button).toBeDisabled()
    expect(onResend).not.toHaveBeenCalled()
  })
})
