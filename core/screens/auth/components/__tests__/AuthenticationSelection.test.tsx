import React from 'react'
import { AuthenticationSelection } from '@holi/core/screens/auth/components/AuthenticationSelection'
import { render, screen, userEvent } from '@testing-library/react-native'
import { Button } from 'holi-bricks/components/button'

const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  return <Button onPress={onLogin} label="login-button" />
}
jest.mock('@holi/core/screens/auth/components/LoginForm', () => ({
  LoginForm,
}))

const RegistrationForm = ({ onRegister }: { onRegister: () => void }) => {
  return <Button onPress={onRegister} label="register-button" />
}
jest.mock('@holi/core/screens/auth/components/RegistrationForm', () => ({
  RegistrationForm,
}))

describe('AuthenticationSelection', () => {
  it('should render login form as initial selection', () => {
    render(<AuthenticationSelection initialSelection="login" />)

    expect(screen.getByLabelText('login-button')).toBeOnTheScreen()
  })

  it('should render registration form as initial selection', () => {
    render(<AuthenticationSelection initialSelection="registration" />)

    expect(screen.getByLabelText('register-button')).toBeOnTheScreen()
  })

  it('should switch rendered form', async () => {
    const user = userEvent.setup()

    render(<AuthenticationSelection initialSelection="login" />)

    expect(screen.getByLabelText('login-button')).toBeOnTheScreen()

    await user.press(screen.getByLabelText('auth.tabs.register'))

    expect(screen.getByLabelText('register-button')).toBeOnTheScreen()

    await user.press(screen.getByLabelText('auth.tabs.login'))

    expect(screen.getByLabelText('login-button')).toBeOnTheScreen()
  })

  it('should call login callback on login', async () => {
    const onLogin = jest.fn()
    const user = userEvent.setup()

    render(<AuthenticationSelection initialSelection="login" onLogin={onLogin} />)

    await user.press(screen.getByLabelText('login-button'))

    expect(onLogin).toHaveBeenCalled()
  })

  it('should call register callback on register', async () => {
    const onRegister = jest.fn()
    const user = userEvent.setup()

    render(<AuthenticationSelection initialSelection="registration" onRegister={onRegister} />)

    await user.press(screen.getByLabelText('register-button'))

    expect(onRegister).toHaveBeenCalled()
  })
})
