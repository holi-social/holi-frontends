import React from 'react'
import { LoginCallback } from '@holi/core/auth/screens/LoginCallback'
import { render, screen } from '@testing-library/react-native'
import * as WebBrowser from 'expo-web-browser'

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
    mockMaybeCompleteAuthSession.mockReturnValue({ type: 'success', message: 'some message' })
  })

  it('should render loader', () => {
    render(<LoginCallback />)

    expect(screen.getByTestId('loader')).toBeOnTheScreen()
  })

  it('should complete browser auth session', () => {
    render(<LoginCallback />)

    expect(mockMaybeCompleteAuthSession).toHaveBeenCalledWith({
      skipRedirectCheck: false,
    })
  })

  it('should display error and navigate to login if completing the auth session failed', () => {
    const response: WebBrowser.WebBrowserCompleteAuthSessionResult = { type: 'failed', message: 'some message' }
    mockMaybeCompleteAuthSession.mockReturnValue(response)

    render(<LoginCallback />)

    expect(mockDisplayError).toHaveBeenCalledWith(response, 'Failed to complete OIDC auth session', {
      location: 'LoginCallback.maybeCompleteAuthSession',
    })
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})
