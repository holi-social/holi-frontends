import { render } from '@testing-library/react-native'
import React from 'react'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import { UserProfileScreen } from '@holi/core/profile/UserProfileScreen'

describe('renders correctly', () => {
  it('renders profile when logged in', () => {
    const { queryByText } = render(
      <AuthContext.Provider value={{ isAuthenticated: true, setUserLoggedIn: jest.fn(), setUserLoggedOut: jest.fn() }}>
        <UserProfileScreen />
      </AuthContext.Provider>
    )

    expect(queryByText('Profile')).toBeTruthy()
    expect(queryByText('Log in to see your profile')).toBeFalsy()
    expect(queryByText('Login')).toBeFalsy()
  })

  it('renders login hint when logged out', () => {
    const { queryByText } = render(<UserProfileScreen />)

    expect(queryByText('Log in to see your profile')).toBeTruthy()
    expect(queryByText('Login')).toBeTruthy()
    expect(queryByText('Profile')).toBeFalsy()
  })
})
