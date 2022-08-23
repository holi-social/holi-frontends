import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import LoginProtection from '@holi/core/auth/components/LoginProtection'

describe('renders correctly', () => {
  it('renders protected content when logged in', () => {
    const { queryByText } = render(
      <AuthContext.Provider
        value={{ isLoading: false, isLoggedIn: true, setUserLoggedIn: jest.fn(), setUserLoggedOut: jest.fn() }}
      >
        <LoginProtection>
          <Text>Protected Content</Text>
        </LoginProtection>
      </AuthContext.Provider>
    )

    expect(queryByText('Protected Content')).toBeTruthy()
    expect(queryByText('auth.loginProtection.text')).toBeFalsy()
    expect(queryByText('auth.loginProtection.login')).toBeFalsy()
  })

  it('renders fallback content when logged out and no other content was provided', () => {
    const { queryByText } = render(<LoginProtection>Protected Content</LoginProtection>)

    expect(queryByText('auth.loginProtection.text')).toBeTruthy()
    expect(queryByText('auth.loginProtection.login')).toBeTruthy()
    expect(queryByText('Protected Content')).toBeFalsy()
  })

  it('renders provided logged out content when logged out', () => {
    const { queryByText } = render(
      <LoginProtection loggedOutContent={<Text>Fallback content</Text>}>Protected Content</LoginProtection>
    )

    expect(queryByText('Fallback content')).toBeTruthy()
    expect(queryByText('auth.loginProtection.login')).toBeTruthy()
    expect(queryByText('auth.loginProtection.text')).toBeFalsy()
    expect(queryByText('Protected Content')).toBeFalsy()
  })
})

describe('allows user to log in', () => {
  it('navigates to login', () => {
    const { getByText } = render(<LoginProtection>Protected Content</LoginProtection>)

    fireEvent.press(getByText('auth.loginProtection.login'))

    expect(mockLinkTo).toHaveBeenCalledWith('/login')
  })
})
