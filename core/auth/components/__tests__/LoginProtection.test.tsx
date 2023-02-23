import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import LoginProtection from '@holi/core/auth/components/LoginProtection'

describe('renders correctly', () => {
  it('renders protected content when logged in', () => {
    const { queryByText } = render(
      <AuthContext.Provider
        value={{
          userId: 'abc',
          isLoading: false,
          isLoggedIn: true,
          setUserLoggedIn: jest.fn(),
          setUserLoggedOut: jest.fn(),
        }}
      >
        <LoginProtection>
          <Text>Protected Content</Text>
        </LoginProtection>
      </AuthContext.Provider>
    )

    expect(queryByText('Protected Content')).toBeTruthy()
    expect(queryByText('profile.loggedOut.heading')).toBeFalsy()
    expect(queryByText('auth.loginProtection.registration')).toBeFalsy()
  })

  it('renders fallback content when logged out and no other content was provided', () => {
    const { queryByText } = render(<LoginProtection>Protected Content</LoginProtection>)

    expect(queryByText('profile.loggedOut.heading')).toBeTruthy()
    expect(queryByText('auth.loginProtection.registration')).toBeTruthy()
    expect(queryByText('Protected Content')).toBeFalsy()
  })

  describe('navigates to', () => {
    it('registration', () => {
      const { getByText } = render(<LoginProtection>Protected Content</LoginProtection>)

      fireEvent.press(getByText('auth.loginProtection.registration'))

      expect(mockNavigate).toHaveBeenCalledWith('/registration')
    })

    it('login', () => {
      const { getByText } = render(<LoginProtection>Protected Content</LoginProtection>)

      fireEvent.press(getByText('auth.login'))

      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    it('home', () => {
      const { getByText } = render(<LoginProtection>Protected Content</LoginProtection>)

      fireEvent.press(getByText('auth.loginProtection.continueAsGuest'))

      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})
