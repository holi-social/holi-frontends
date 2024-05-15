import { render } from '@testing-library/react-native'
import React from 'react'

import OwnProfile from '@holi/core/screens/userprofile/OwnProfile'

interface UseAuthReturn {
  userId: string | null
  isLoggedIn: boolean
}

const useAuth = {
  login: {
    userId: 'some_id',
    isLoggedIn: true,
  },
  logout: {
    userId: null,
    isLoggedIn: false,
  },
}

let mockUseAuthReturn: UseAuthReturn = useAuth.login

jest.mock('@holi/core/auth/helpers/useAuth', () => {
  return {
    useAuth: () => mockUseAuthReturn,
  }
})

let mockIsLoggedIn = true

jest.mock('@holi/core/screens/userprofile/useLoggedInUser', () => ({
  useLoggedInUser: () => ({
    isLoggedIn: mockIsLoggedIn,
  }),
}))

describe.skip('OwnProfile', () => {
  it('renders profile when logged in', () => {
    mockIsLoggedIn = true
    const { queryByText } = render(<OwnProfile />)

    expect(queryByText('profile.loggedOut.heading')).toBeFalsy()
    expect(queryByText('auth.loginProtection.login')).toBeFalsy()
  })

  it('renders login hint when logged out', () => {
    mockIsLoggedIn = false
    mockUseAuthReturn = useAuth.logout
    const { queryByText } = render(<OwnProfile />)

    expect(queryByText('profile.loggedOut.heading')).toBeTruthy()
    expect(queryByText('auth.loginProtection.registration')).toBeTruthy()
    expect(queryByText('auth.loginProtection.continueAsGuest')).toBeTruthy()
  })
})
