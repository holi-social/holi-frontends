import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen, waitForElementToBeRemoved } from 'expo-router/testing-library'
import { Text } from 'holi-bricks/components/text/Text'
import React from 'react'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { loginStateLoggedIn, loginStateLoggedOut, loginStateUnknown } from '@holi/core/auth/loginState'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { CombinedProtocolErrors } from '@apollo/client'
import { AccountType } from '@holi/api/graphql/graphql-codegen'

const mockUseLoginState = jest.fn()
jest.mock('@holi/core/auth/loginState', () => {
  const original = jest.requireActual('@holi/core/auth/loginState')
  return {
    ...original,
    useLoginState: () => mockUseLoginState(),
  }
})

const mockDisplayError = jest.fn()
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: () => ({
    displayError: mockDisplayError,
  }),
}))

const mockIsSSR = jest.fn()
jest.mock('@holi/core/helpers/isSSR', () => ({
  get isSSR() {
    return mockIsSSR()
  },
}))

const TestComponent = () => {
  const { isLoggedIn, isLoggedOut, user } = useLoggedInUser()

  const state = isLoggedIn ? `isLoggedIn: ${user.id}` : isLoggedOut ? 'isLoggedOut' : 'isLoading'

  return <Text>{state}</Text>
}

const mockUserRequest = (userId?: string) => {
  const mockedResponse = {
    request: {
      query: authenticatedUserV2Query,
      variables: userId ? { userId } : undefined,
    },
    result: {
      data: {
        authenticatedUserV2: {
          id: 'test-user-id',
          identity: '',
          avatar: 'https://ik.imagekit.io/holidev/avatar/5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0_eEx60YjuIa.jpg',
          fullName: 'EE. Visited',
          firstName: 'EE.',
          lastName: 'Visited',
          aboutMe: '',
          avatarDefaultColor: '#7571EC',
          avatarLabel: 'EV',
          avatarBlurhash: '',
          pronouns: '',
          location: '',
          role: '',
          geolocationId: '',
          engagementLevel: '',
          interestsV2: [],
          skillsV2: [],
          connectionStatusToMyself: '',
          trackingConsentPersonalization: false,
          trackingConsentAnalytics: false,
          trackingConsentAdPartners: false,
          isEmployee: false,
          email: '',
          isOidc: false,
          accountType: AccountType.Email,
          __typename: 'AuthenticatedUser',
        },
      },
    },
  }
  return { mocks: [mockedResponse] }
}
const mockedFailedRequest = {
  request: {
    query: authenticatedUserV2Query,
    variables: {},
  },
  error: new CombinedProtocolErrors([]),
}

describe('useLoggedInUser', () => {
  beforeEach(() => {
    mockIsSSR.mockReturnValue(false)
  })

  it('should return logged out state', async () => {
    mockUseLoginState.mockReturnValue(loginStateLoggedOut)
    const { mocks } = mockUserRequest()

    render(
      <MockedProvider mocks={mocks}>
        <TestComponent />
      </MockedProvider>
    )

    expect(await screen.findByText('isLoggedOut')).toBeTruthy()
  })

  it('should expose loading state while loading the user', async () => {
    mockUseLoginState.mockReturnValue(loginStateLoggedIn('test-user-id'))
    const { mocks } = mockUserRequest('test-user-id')

    render(
      <MockedProvider mocks={mocks}>
        <TestComponent />
      </MockedProvider>
    )

    expect(await screen.findByText('isLoading')).toBeTruthy()
  })

  it('should expose loading state if user was not loaded and login state is unknown', async () => {
    mockUseLoginState.mockReturnValue(loginStateUnknown)
    const { mocks } = mockUserRequest()

    render(
      <MockedProvider mocks={mocks}>
        <TestComponent />
      </MockedProvider>
    )

    expect(await screen.findByText('isLoading')).toBeTruthy()
  })

  it('should expose user if it was loaded independent of the login state', async () => {
    mockUseLoginState.mockReturnValue(loginStateUnknown)
    const { mocks } = mockUserRequest()

    render(
      <MockedProvider mocks={mocks}>
        <TestComponent />
      </MockedProvider>
    )

    await waitForElementToBeRemoved(() => screen.getByText('isLoading'))

    expect(await screen.findByText('isLoggedIn: test-user-id')).toBeTruthy()
  })

  it('should display error if loading the user failed', async () => {
    mockUseLoginState.mockReturnValue(loginStateUnknown)

    render(
      <MockedProvider mocks={[mockedFailedRequest]}>
        <TestComponent />
      </MockedProvider>
    )

    await waitForElementToBeRemoved(() => screen.getByText('isLoading'))

    expect(mockDisplayError).toHaveBeenCalledWith(expect.any(Object), 'Failed to load authenticated user', {
      location: 'useLoggedInUser.authenticatedUserQuery',
    })
  })

  it('should return logged out state if loading the user failed', async () => {
    mockUseLoginState.mockReturnValue(loginStateUnknown)

    render(
      <MockedProvider mocks={[mockedFailedRequest]}>
        <TestComponent />
      </MockedProvider>
    )

    await waitForElementToBeRemoved(() => screen.getByText('isLoading'))

    expect(await screen.findByText('isLoggedOut')).toBeTruthy()
  })

  it('should return logged out state if user is not in cache during ssr', async () => {
    mockIsSSR.mockReturnValue(true)
    mockUseLoginState.mockReturnValue(loginStateUnknown)
    const mockLoggedOutUserRequest = {
      request: {
        query: authenticatedUserV2Query,
      },
      result: {
        data: {
          authenticatedUserV2: null,
        },
      },
    }

    render(
      <MockedProvider mocks={[mockLoggedOutUserRequest]}>
        <TestComponent />
      </MockedProvider>
    )

    expect(await screen.findByText('isLoggedOut')).toBeTruthy()
  })
})
