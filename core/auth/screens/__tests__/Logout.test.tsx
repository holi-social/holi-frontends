import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { useLogout } from '@holi/core/helpers'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import Logout from '@holi/core/auth/screens/Logout'
import { AccountType } from '@holi/api/graphql/graphql-codegen'

jest.mock('@holi/core/components/ScrollHeaderLayout/useMobileScrollHandler')

const mockUseLogout = jest.mocked(useLogout)
jest.mock('@holi/core/helpers', () => ({
  useLogout: jest.fn(),
}))

const mockUseLoggedInUser = jest.mocked(useLoggedInUser)
jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: jest.fn(),
}))

describe('Logout', () => {
  const mockLogout = jest.fn()

  beforeEach(() => {
    mockUseLogout.mockReturnValue({
      logout: mockLogout,
      isLoggingOut: false,
    })
    mockUseLoggedInUser.mockReturnValue({
      state: 'loggedIn',
      isLoading: false,
      isLoggedIn: true,
      isLoggedOut: false,
      user: {
        email: '',
        isEmployee: false,
        isOidc: false,
        id: '',
        identity: '',
        avatarDefaultColor: '',
        avatarLabel: '',
        fullName: '',
        accountType: AccountType.Email,
      },
    })
  })

  it('should trigger logout if logged in', () => {
    render(<Logout />)

    expect(mockLogout).toHaveBeenCalled()

    expect(screen.getByText('oauth2.logout')).toBeOnTheScreen()
  })

  it('should do nothing if not logged in', () => {
    mockUseLoggedInUser.mockReturnValue({
      state: 'loggedOut',
      isLoading: false,
      isLoggedIn: false,
      isLoggedOut: true,
      user: undefined,
    })

    render(<Logout />)

    expect(mockLogout).not.toHaveBeenCalled()
    expect(screen.getByText('oauth2.loggedOut')).toBeOnTheScreen()
  })
})
