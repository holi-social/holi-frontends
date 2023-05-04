import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import LoginProtection from '@holi/core/auth/components/LoginProtection.web'
import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { authenticatedUserQuery } from '@holi/core/screens/userprofile/queries'

const loggedIn = () => ({ userId: '123' })
const loggedOut = () => ({ userId: null })
const useAuthMock = useAuth as jest.Mock

jest.mock('@holi/core/auth/helpers/useAuth', () => ({
  useAuth: jest.fn(),
  setUserLoggedOut: jest.fn(),
}))

const authenticatedUserRequest = {
  request: {
    query: authenticatedUserQuery,
    variables: {},
  },
  result: {
    data: {
      authenticatedUser: {
        id: '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0',
        avatar: 'https://ik.imagekit.io/holidev/avatar/5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0_eEx60YjuIa.jpg',
        fullName: 'EE. Visited',
        firstName: 'EE.',
        lastName: 'Visited',
        aboutMe: "I'm the User that is visited in E2E tests!",
        avatarDefaultColor: '#7571EC',
        avatarLabel: 'EV',
      },
    },
  },
}

describe('renders correctly', () => {
  it('renders protected content when logged in', async () => {
    useAuthMock.mockImplementation(loggedIn)

    render(
      <MockedProvider mocks={[authenticatedUserRequest]} addTypename={false}>
        <LoginProtection>
          <Text>Protected Content</Text>
        </LoginProtection>
      </MockedProvider>
    )

    await waitForElementToBeRemoved(() => screen.getByTestId('loader'))
    expect(screen.queryByText('Protected Content')).toBeTruthy()
    expect(screen.queryByText('profile.loggedOut.heading')).toBeFalsy()
    expect(screen.queryByText('auth.loginProtection.registration')).toBeFalsy()
  })

  it('renders fallback content when logged out and no other content was provided', async () => {
    useAuthMock.mockImplementation(loggedOut)

    const { queryByText } = render(
      <MockedProvider mocks={[authenticatedUserRequest]} addTypename={false}>
        <LoginProtection>Protected Content</LoginProtection>
      </MockedProvider>
    )

    expect(queryByText('profile.loggedOut.heading')).toBeTruthy()
    expect(queryByText('auth.loginProtection.registration')).toBeTruthy()
    expect(queryByText('Protected Content')).toBeFalsy()
  })

  describe('navigates to', () => {
    it('registration', () => {
      useAuthMock.mockImplementation(loggedOut)

      const { getByText } = render(
        <MockedProvider mocks={[authenticatedUserRequest]} addTypename={false}>
          <LoginProtection>Protected Content</LoginProtection>
        </MockedProvider>
      )

      fireEvent.press(getByText('auth.loginProtection.registration'))

      // goes to Privacy Policy step
      expect(getByText('registration.communityGuidelines.heading')).not.toBeNull()
    })

    it('login', () => {
      useAuthMock.mockImplementation(loggedOut)

      const { getByTestId } = render(
        <MockedProvider mocks={[authenticatedUserRequest]} addTypename={false}>
          <LoginProtection>Protected Content</LoginProtection>
        </MockedProvider>
      )

      fireEvent.press(getByTestId('btn-to-login-form'))

      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    it('home', () => {
      useAuthMock.mockImplementation(loggedOut)

      const { getByText } = render(
        <MockedProvider mocks={[authenticatedUserRequest]} addTypename={false}>
          <LoginProtection>Protected Content</LoginProtection>
        </MockedProvider>
      )

      fireEvent.press(getByText('auth.loginProtection.continueAsGuest'))

      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})
