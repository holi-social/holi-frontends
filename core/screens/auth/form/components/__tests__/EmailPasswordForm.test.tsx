import React from 'react'
import { EmailPasswordForm } from '@holi/core/screens/auth/form/components/EmailPasswordForm'
import { renderRouter, render, screen, userEvent, fireEvent } from 'expo-router/testing-library'
import { TrackingEvent } from '@holi/core/tracking'

describe('EmailPasswordForm', () => {
  it('should render correct input fields and buttons for email and password login', () => {
    render(
      <EmailPasswordForm
        setEmail={jest.fn()}
        setPassword={jest.fn()}
        submitLabel="custom submit label"
        onSubmit={jest.fn()}
      />
    )

    expect(screen.getByLabelText('auth.login.input.label-Email'))
    expect(screen.getByLabelText('auth.login.input.label-Password'))
    expect(screen.getByLabelText('custom submit label'))
  })

  it('should control email input', async () => {
    const user = userEvent.setup()
    const setEmail = jest.fn()
    render(
      <EmailPasswordForm
        email="ada@"
        setEmail={setEmail}
        emailValidationError="invalid email"
        setPassword={jest.fn()}
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

  it('should control password input', async () => {
    const user = userEvent.setup()
    const setPassword = jest.fn()
    render(
      <EmailPasswordForm
        password="123"
        passwordValidationError="invalid password"
        setEmail={jest.fn()}
        setPassword={setPassword}
        submitLabel=""
        onSubmit={jest.fn()}
      />
    )

    const passwordInput = screen.getByLabelText('auth.login.input.label-Password')

    expect(passwordInput.props.value).toEqual('123')
    expect(screen.getByText('invalid password')).toBeOnTheScreen()

    await user.type(passwordInput, '4')

    expect(setPassword).toHaveBeenCalledWith('1234')
  })

  it('should submit the form on enter in email input field', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const setEmail = jest.fn()
    render(<EmailPasswordForm setEmail={setEmail} setPassword={jest.fn()} submitLabel="" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('auth.login.input.label-Email'), 'a{Enter}')

    expect(setEmail).toHaveBeenCalledWith('a')
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should submit the form on enter in password input field', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    const setPassword = jest.fn()
    render(<EmailPasswordForm setEmail={jest.fn()} setPassword={setPassword} submitLabel="" onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('auth.login.input.label-Password'), 'a{Enter}')

    expect(setPassword).toHaveBeenCalledWith('a')
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should submit the form on button press', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    render(
      <EmailPasswordForm
        setEmail={jest.fn()}
        setPassword={jest.fn()}
        submitLabel="custom submit label"
        onSubmit={onSubmit}
      />
    )

    await user.press(screen.getByLabelText('custom submit label'))

    expect(onSubmit).toHaveBeenCalled()
  })

  it('should not submit the form on button press if the button is disabled', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn()
    render(
      <EmailPasswordForm
        setEmail={jest.fn()}
        setPassword={jest.fn()}
        submitLabel="custom submit label"
        onSubmit={onSubmit}
        submitDisabled={true}
      />
    )

    const button = screen.getByLabelText('custom submit label')

    await user.press(button)

    expect(button).toBeDisabled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should render text and link to reset password', () => {
    render(<EmailPasswordForm setEmail={jest.fn()} setPassword={jest.fn()} submitLabel="" onSubmit={jest.fn()} />)

    expect(screen.getByText('auth.login.forgotPassword'))
    expect(screen.getByLabelText('auth.login.link.forgotPassword'))
  })

  it('should track and navigate to reset password', async () => {
    const context = renderRouter({
      index: () => (
        <EmailPasswordForm setEmail={jest.fn()} setPassword={jest.fn()} submitLabel="" onSubmit={jest.fn()} />
      ),
    })

    fireEvent.press(screen.getByLabelText('auth.login.link.forgotPassword'))

    expect(context).toHavePathname('/forgotPassword')
    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.Auth.ForgotPasswordButtonPressed)
  })
})
