import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import { LoginState, useAuth } from '@holi/core/auth/helpers/useAuth'
import { authenticatedUserV2Query } from '@holi/core/screens/userprofile/queries'

const loggedIn = (): LoginState => {
  return {
    loginState: 'loggedIn',
    isUnknown: false,
    isLoggedOut: false,
    isLoggedIn: true,
    userId: '123',
  }
}
const loggedOut = (): LoginState => ({
  loginState: 'loggedOut',
  isUnknown: false,
  isLoggedOut: true,
  isLoggedIn: false,
})
const useAuthMock = useAuth as jest.Mock

jest.mock('@holi/core/auth/helpers/useAuth', () => ({
  useAuth: jest.fn(),
  setUserLoggedOut: jest.fn(),
}))

jest.mock('@holi/core/helpers/useDocumentURL', () => ({
  useDocumentURL: () => new URL('https://localhost:3000').href,
}))
const mockUseFeatureToggle = jest.fn()
jest.mock('@holi/core/helpers/useFeatureToggle', () => ({
  useFeatureToggle: () => mockUseFeatureToggle(),
  FeatureToggleName: {
    THEME_TOGGLE: 'THEME_TOGGLE',
  },
}))

const authenticatedUserRequest = {
  request: {
    query: authenticatedUserV2Query,
    variables: { userId: '123' },
  },
  result: {
    data: {
      authenticatedUserV2: {
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

describe('LoginProtection', () => {
  beforeEach(() => {
    mockUseFeatureToggle.mockReturnValue({ ftEnabled: false })
  })

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

  it('renders AnonymousProfileView when logged out', async () => {
    useAuthMock.mockImplementation(loggedOut)

    const { queryByText } = render(
      <MockedProvider mocks={[authenticatedUserRequest]} addTypename={false}>
        <LoginProtection>Protected Content</LoginProtection>
      </MockedProvider>
    )

    expect(queryByText('profile.anonymous.you')).toBeTruthy()
    expect(queryByText('auth.loginProtection.registration')).toBeTruthy()
    expect(queryByText('auth.loginProtection.login')).toBeTruthy()
    expect(queryByText('Protected Content')).toBeFalsy()
  })

  describe('navigates to', () => {
    it('registration', async () => {
      useAuthMock.mockImplementation(loggedOut)

      render(
        <MockedProvider mocks={[authenticatedUserRequest]} addTypename={false}>
          <LoginProtection>Protected Content</LoginProtection>
        </MockedProvider>
      )

      fireEvent.press(screen.getByTestId('btn-to-registration-form'))

      expect(mockNavigate).toHaveBeenCalledWith('/onboarding/registration')
    })

    it('login', async () => {
      useAuthMock.mockImplementation(loggedOut)

      render(
        <MockedProvider mocks={[authenticatedUserRequest]} addTypename={false}>
          <LoginProtection>Protected Content</LoginProtection>
        </MockedProvider>
      )

      fireEvent.press(screen.getByTestId('anonymous-profile-login-btn'))

      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })
})
