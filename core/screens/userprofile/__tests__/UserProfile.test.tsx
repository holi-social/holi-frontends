import { render } from '@testing-library/react-native'
import React from 'react'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import { UserProfileScreen } from '@holi/core/screens/userprofile/UserProfile'

describe('renders correctly', () => {
  it('renders profile when logged in', () => {
    const { queryByText } = render(
      <AuthContext.Provider
        value={{ isLoading: false, isLoggedIn: true, setUserLoggedIn: jest.fn(), setUserLoggedOut: jest.fn() }}
      >
        <UserProfileScreen />
      </AuthContext.Provider>
    )

    expect(queryByText('Inspirational text about your profile')).toBeFalsy()
    expect(queryByText('Log in')).toBeFalsy()
  })

  it('renders login hint when logged out', () => {
    const { queryByText } = render(<UserProfileScreen />)

    expect(queryByText('Inspirational text about your profile')).toBeTruthy()
    expect(queryByText('Log in')).toBeTruthy()
  })
})
