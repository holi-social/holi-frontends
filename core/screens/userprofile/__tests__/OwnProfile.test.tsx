import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { insightsByUserIdTotalResultsQuery } from '@holi/core/queries'
import OwnProfile from '@holi/core/screens/userprofile/OwnProfile.web'

const mockUseLoggedInUser = jest.fn()
jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: () => mockUseLoggedInUser(),
}))

const mockUseFeatureFlag = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: () => mockUseFeatureFlag(),
}))

const insightsCountRequest = {
  request: {
    query: insightsByUserIdTotalResultsQuery,
    variables: { userId: '123' },
  },
  result: {
    data: {
      insightsByUserId: {
        totalResults: 0,
      },
    },
  },
}

describe('OwnProfile', () => {
  beforeEach(() => {
    mockUseFeatureFlag.mockReturnValue([false, undefined])
  })

  it('renders profile when logged in', () => {
    mockUseLoggedInUser.mockReturnValue({
      isLoggedIn: true,
      user: { id: '123', fullName: 'Test User' },
    })

    render(
      <MockedProvider mocks={[insightsCountRequest]}>
        <OwnProfile />
      </MockedProvider>
    )

    expect(screen.queryByText('Test User')).toBeTruthy()
    expect(screen.queryByText('profile.anonymous.you')).toBeFalsy()
    expect(screen.queryByText('auth.loginProtection.registration')).toBeFalsy()
    expect(screen.queryByText('auth.loginProtection.login')).toBeFalsy()
  })

  it('renders AnonymousProfileView when logged out', () => {
    mockUseLoggedInUser.mockReturnValue({
      isLoggedIn: false,
      isLoading: false,
    })

    render(
      <MockedProvider>
        <OwnProfile />
      </MockedProvider>
    )

    expect(screen.queryByText('profile.anonymous.you')).toBeTruthy()
    expect(screen.queryByText('auth.loginProtection.registration')).toBeTruthy()
    expect(screen.queryByText('auth.loginProtection.login')).toBeTruthy()
  })
})
