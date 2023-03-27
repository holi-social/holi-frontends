import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import LoginProtection from '@holi/core/auth/components/LoginProtection.web'

// Mock useAuth and useLoggedInUser hooks
interface UseAuthReturn {
  userId: string | null
  isLoggedIn: boolean
}

interface UseLoggedInUserReturn {
  name?: string
}

interface GetMockOptionsReturn {
  useAuth: UseAuthReturn
  useLoggedInUser: UseLoggedInUserReturn
}

let isLoggedIn = true

const getMockOptions = (): GetMockOptionsReturn => {
  return isLoggedIn
    ? {
        useAuth: {
          userId: 'some_id',
          isLoggedIn: true,
        },
        useLoggedInUser: {
          name: 'user_name',
        },
      }
    : {
        useAuth: {
          userId: null,
          isLoggedIn: false,
        },
        useLoggedInUser: {},
      }
}

jest.mock('@holi/core/auth/helpers/useAuth', () => {
  return {
    useAuth: () => getMockOptions().useAuth,
  }
})

jest.mock('@holi/core/screens/userprofile/UserContextProvider', () => {
  return {
    useLoggedInUser: () => getMockOptions().useLoggedInUser,
  }
})

describe('renders correctly', () => {
  it('renders protected content when logged in', () => {
    isLoggedIn = true

    const { queryByText } = render(
      <LoginProtection>
        <Text>Protected Content</Text>
      </LoginProtection>
    )

    expect(queryByText('Protected Content')).toBeTruthy()
    expect(queryByText('profile.loggedOut.heading')).toBeFalsy()
    expect(queryByText('auth.loginProtection.registration')).toBeFalsy()
  })

  it('renders fallback content when logged out and no other content was provided', () => {
    isLoggedIn = false

    const { queryByText } = render(
      <LoginProtection>
        <Text>Protected Content</Text>
      </LoginProtection>
    )

    expect(queryByText('profile.loggedOut.heading')).toBeTruthy()
    expect(queryByText('auth.loginProtection.registration')).toBeTruthy()
    expect(queryByText('Protected Content')).toBeFalsy()
  })

  describe('navigates to', () => {
    it('registration', () => {
      isLoggedIn = false

      const { getByText } = render(<LoginProtection>Protected Content</LoginProtection>)

      fireEvent.press(getByText('auth.loginProtection.registration'))

      // goes to Privicy Policy step
      expect(getByText('registration.communityGuidelines.heading')).not.toBeNull()
    })

    it('login', () => {
      isLoggedIn = false

      const { getByTestId } = render(<LoginProtection>Protected Content</LoginProtection>)

      fireEvent.press(getByTestId('btn-to-login-form'))

      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    it('home', () => {
      isLoggedIn = false

      const { getByText } = render(<LoginProtection>Protected Content</LoginProtection>)

      fireEvent.press(getByText('auth.loginProtection.continueAsGuest'))

      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})
