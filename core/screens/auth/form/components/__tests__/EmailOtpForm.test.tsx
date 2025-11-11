import React from 'react'
import { EmailOtpForm } from '@holi/core/screens/auth/form/components/EmailOtpForm'
import { render, screen, userEvent } from 'expo-router/testing-library'

describe('EmailOtpForm', () => {
  it('should render email input field and buttons for email otp login', () => {
    render(<EmailOtpForm setEmail={jest.fn()} submitLabel="custom submit label" onSubmit={jest.fn()} />)

    expect(screen.getByLabelText('auth.login.input.label-Email'))
    expect(screen.getByLabelText('custom submit label'))
  })

  it('should control email input', async () => {
    const user = userEvent.setup()
    const setEmail = jest.fn()
    render(
      <EmailOtpForm
        email="ada@"
        setEmail={setEmail}
        emailValidationError="invalid email"
        submitLabel=""
        onSubmit={jest.fn()}
      />
    )

    const emailInput = screen.getByLabelText('auth.login.input.label-Email')

    expect(emailInput.props.value).toEqual('ada@')
    expect(screen.getByText('invalid email')).toBeOnTheScreen()

    await user.type(emailInput, 'l')

    expect(setEmail).toHaveBeenCalledWith('ada@l')
  })

  it('should submit the form on enter in email input field', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const setEmail = jest.fn()
    render(<EmailOtpForm setEmail={setEmail} submitLabel="" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('auth.login.input.label-Email'), 'a{Enter}')

    expect(setEmail).toHaveBeenCalledWith('a')
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should submit the form on button press', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    render(<EmailOtpForm setEmail={jest.fn()} submitLabel="custom submit label" onSubmit={onSubmit} />)

    await user.press(screen.getByLabelText('custom submit label'))

    expect(onSubmit).toHaveBeenCalled()
  })

  it('should not submit the form on button press if the button is disabled', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    render(
      <EmailOtpForm setEmail={jest.fn()} submitLabel="custom submit label" onSubmit={onSubmit} submitDisabled={true} />
    )

    const button = screen.getByLabelText('custom submit label')

    await user.press(button)

    expect(button).toBeDisabled()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
