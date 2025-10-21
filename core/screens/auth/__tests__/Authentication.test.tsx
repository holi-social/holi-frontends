import React from 'react'
import { Authentication, type AuthenticationProps } from '@holi/core/screens/auth/Authentication'
import { render, screen, userEvent } from '@testing-library/react-native'
import { Button } from 'holi-bricks/components/button'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import HeaderAnimated from '@holi/core/components/HeaderAnimated/index.web'
import { storeGuestMode } from '@holi/core/screens/onboarding/helpers/guestModeStorage'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { AccountType } from '@holi/api/graphql/graphql-codegen'

jest.mock('@holi/core/helpers/useLogout')

jest.mock('@holi/core/navigation/hooks/useParam')

const mockStoreGuestMode = jest.mocked(storeGuestMode)
jest.mock('@holi/core/screens/onboarding/helpers/guestModeStorage', () => ({
  storeGuestMode: jest.fn(),
}))

const mockUseLoggedInUser = jest.mocked(useLoggedInUser)
jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: jest.fn(),
}))

jest.useFakeTimers()

const AuthenticationSelection = ({ onLogin, onRegister }: AuthenticationProps) => {
  return (
    <>
      <Button onPress={onLogin} label="login-button" />
      <Button onPress={onRegister} label="register-button" />
    </>
  )
}
jest.mock('@holi/core/screens/auth/components/AuthenticationSelection', () => ({
  AuthenticationSelection,
}))

describe('Authentication', () => {
  beforeEach(() => {
    mockParameters()
    mockUseLoggedInUser.mockReturnValue({
      isLoggedIn: false,
      isLoggedOut: true,
      isLoading: false,
      user: undefined,
      state: 'loggedOut',
    })
  })

  it('should render and authentication selection', () => {
    render(<Authentication initialSelection="login" />)

    expect(screen.getByLabelText('login-button'))
    expect(screen.getByLabelText('register-button'))
  })

  it('should call onLogin callback on login', async () => {
    const onLogin = jest.fn()
    const user = userEvent.setup()

    render(<Authentication initialSelection="login" onLogin={onLogin} />)

    await user.press(screen.getByLabelText('login-button'))

    expect(onLogin).toHaveBeenCalled()
  })

  it('should call register callback on register', async () => {
    const onRegister = jest.fn()
    const user = userEvent.setup()

    render(<Authentication initialSelection="registration" onRegister={onRegister} />)

    await user.press(screen.getByLabelText('register-button'))

    expect(onRegister).toHaveBeenCalled()
  })

  it('should enable guest mode and call onContinueAsGuest callback on close', async () => {
    const onContinueAsGuest = jest.fn()
    const user = userEvent.setup()

    render(
      <>
        <HeaderAnimated />
        <Authentication initialSelection="login" onContinueAsGuest={onContinueAsGuest} />
      </>
    )

    await user.press(screen.getByTestId('nav-button-back'))

    expect(mockStoreGuestMode).toHaveBeenCalledWith(true)
    expect(onContinueAsGuest).toHaveBeenCalled()
  })

  it('should render loading if user is already logged in', async () => {
    mockUseLoggedInUser.mockReturnValue({
      isLoading: false,
      isLoggedIn: true,
      isLoggedOut: false,
      user: {
        id: 'test-user-id',
        identity: 'test-user',
        accountType: AccountType.Email,
        avatarDefaultColor: '#7571EC',
        avatarLabel: 'TU',
        fullName: 'Test User',
        isEmployee: false,
        email: 'test@example.com',
        isOidc: false,
      },
      state: 'loggedIn',
    })

    render(<Authentication initialSelection="login" onLogin={jest.fn()} />)

    expect(screen.getByTestId('loader')).toBeOnTheScreen()
  })
})
