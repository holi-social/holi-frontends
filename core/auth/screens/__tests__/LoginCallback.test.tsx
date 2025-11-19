import React from 'react'
import { LoginCallback } from '@holi/core/auth/screens/LoginCallback'
import { screen, waitFor } from '@testing-library/react-native'
import { renderRouter } from 'expo-router/testing-library'

import * as WebBrowser from 'expo-web-browser'
import { Text } from 'react-native'

const mockMaybeCompleteAuthSession = jest.mocked(WebBrowser.maybeCompleteAuthSession)
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}))

const mockDisplayError = jest.fn()
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: () => ({
    displayError: mockDisplayError,
  }),
}))

describe('LoginCallback', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockMaybeCompleteAuthSession.mockReturnValue({ type: 'success', message: 'some message' })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render loader', () => {
    renderRouter({ index: () => <LoginCallback /> })

    expect(screen.getByTestId('loader')).toBeOnTheScreen()
  })

  it('should complete browser auth session', () => {
    renderRouter({ index: () => <LoginCallback /> })

    expect(mockMaybeCompleteAuthSession).toHaveBeenCalledWith({
      skipRedirectCheck: false,
    })
  })

  it('should display error and navigate to login eventually if completing the auth session failed', async () => {
    const response: WebBrowser.WebBrowserCompleteAuthSessionResult = { type: 'failed', message: 'some message' }
    mockMaybeCompleteAuthSession.mockReturnValue(response)

    const context = renderRouter({
      index: () => <LoginCallback />,
      login: () => <Text>Login</Text>,
    })

    jest.runOnlyPendingTimers()

    expect(mockDisplayError).toHaveBeenCalledWith(response, 'Failed to complete OIDC auth session', {
      location: 'LoginCallback.maybeCompleteAuthSession',
    })

    await waitFor(() => expect(context).toHavePathname('/login'))
  })
})
