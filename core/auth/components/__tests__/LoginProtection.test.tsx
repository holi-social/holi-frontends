import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text/Text'
import React from 'react'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import { type LoginState, useLoginState } from '@holi/core/auth/loginState'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'

const loggedIn = (): LoginState => {
  return {
    isUnknown: false,
    isLoggedOut: false,
    isLoggedIn: true,
    userId: '123',
  }
}
const loggedOut = (): LoginState => ({
  isUnknown: false,
  isLoggedOut: true,
  isLoggedIn: false,
})
const useLoginStateMock = useLoginState as jest.Mock

jest.mock('@holi/core/auth/loginState', () => ({
  useLoginState: jest.fn(),
  setUserLoggedOut: jest.fn(),
}))

jest.mock('@holi/core/helpers/useDocumentURL', () => ({
  useDocumentURL: () => new URL('https://localhost:3000').href,
}))

const mockUseFeatureFlag = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: () => mockUseFeatureFlag(),
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
    mockUseFeatureFlag.mockReturnValue([false, undefined])
  })

  it('renders protected content when logged in', async () => {
    useLoginStateMock.mockImplementation(loggedIn)

    render(
      <MockedProvider mocks={[authenticatedUserRequest]} addTypename={false}>
        <LoginProtection>
          <Text size="md">Protected Content</Text>
        </LoginProtection>
      </MockedProvider>
    )

    await waitForElementToBeRemoved(() => screen.getByTestId('loader'))
    expect(screen.queryByText('Protected Content')).toBeTruthy()
    expect(screen.queryByText('profile.loggedOut.heading')).toBeFalsy()
    expect(screen.queryByText('auth.loginProtection.registration')).toBeFalsy()
  })

  it('renders AnonymousProfileView when logged out', async () => {
    useLoginStateMock.mockImplementation(loggedOut)

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
      useLoginStateMock.mockImplementation(loggedOut)

      render(
        <MockedProvider mocks={[authenticatedUserRequest]} addTypename={false}>
          <LoginProtection>Protected Content</LoginProtection>
        </MockedProvider>
      )

      fireEvent.press(screen.getByTestId('btn-to-registration-form'))

      expect(mockNavigate).toHaveBeenCalledWith('/onboarding')
    })

    it('login', async () => {
      useLoginStateMock.mockImplementation(loggedOut)

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
