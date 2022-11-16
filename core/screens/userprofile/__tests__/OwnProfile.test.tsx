import { MockedProvider } from '@apollo/client/testing'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { createCache } from '@holi/api/graphql/client'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import OwnProfile from '@holi/core/screens/userprofile/OwnProfile'
import { sdgsQuery, skillsQuery, topicsQuery } from '@holi/core/screens/userprofile/queries'

const graphQLMocks = [
  {
    request: {
      query: topicsQuery,
    },
    result: () => {
      console.warn('========== topicsMock')
      return {
        data: {
          topics: [],
        },
      }
    },
  },
  {
    request: {
      query: sdgsQuery,
    },
    result: () => {
      console.warn('========== sdgsMock')
      return {
        data: {
          sdgs: [],
        },
      }
    },
  },
  {
    request: {
      query: skillsQuery,
    },
    result: () => {
      console.warn('========== skillsMock')
      return {
        data: {
          skills: [],
        },
      }
    },
  },
]

describe('renders correctly', () => {
  it('renders profile when logged in', async () => {
    render(
      <MockedProvider mocks={graphQLMocks} cache={createCache()} addTypename={false}>
        <AuthContext.Provider
          value={{ isLoading: false, isLoggedIn: true, setUserLoggedIn: jest.fn(), setUserLoggedOut: jest.fn() }}
        >
          <OwnProfile />
        </AuthContext.Provider>
      </MockedProvider>
    )

    expect(await screen.findByTestId('profile.loggedOut.heading')).not.toBeInTheDocument()
    expect(await screen.findByTestId('auth.loginProtection.login')).not.toBeInTheDocument()
  })

  it('renders login hint when logged out', async () => {
    render(
      <MockedProvider mocks={graphQLMocks} cache={createCache()} addTypename={false}>
        <AuthContext.Provider
          value={{ isLoading: false, isLoggedIn: false, setUserLoggedIn: jest.fn(), setUserLoggedOut: jest.fn() }}
        >
          <OwnProfile />
        </AuthContext.Provider>
      </MockedProvider>
    )

    expect(await screen.findByTestId('profile.loggedOut.heading')).toBeInTheDocument()
    expect(await screen.findByTestId('auth.loginProtection.login')).toBeInTheDocument()
  })
})
