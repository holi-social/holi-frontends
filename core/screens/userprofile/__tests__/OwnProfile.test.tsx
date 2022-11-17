import { render } from '@testing-library/react-native'
import React from 'react'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import OwnProfile from '@holi/core/screens/userprofile/OwnProfile'

describe('OwnProfile', () => {
  it('renders profile when logged in', () => {
    const { queryByText } = render(
      <AuthContext.Provider
        value={{ isLoading: false, isLoggedIn: true, setUserLoggedIn: jest.fn(), setUserLoggedOut: jest.fn() }}
      >
        <OwnProfile />
      </AuthContext.Provider>
    )

    expect(queryByText('profile.loggedOut.heading')).toBeFalsy()
    expect(queryByText('auth.loginProtection.login')).toBeFalsy()
  })

  it('renders login hint when logged out', () => {
    const { queryByText } = render(<OwnProfile />)

    expect(queryByText('profile.loggedOut.heading')).toBeTruthy()
    expect(queryByText('auth.loginProtection.login')).toBeTruthy()
  })
})
