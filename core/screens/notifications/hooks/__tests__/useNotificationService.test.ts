/* eslint-disable no-console */
import { renderHook, waitFor } from 'expo-router/testing-library'

import { useNotificationService } from '@holi/core/screens/notifications/hooks/useNotificationService'

const mockInitializeSession = jest.fn()
const mockSetAuthorizationToken = jest.fn()
const mockUseLoggedInUser = jest.fn()

jest.mock('@holi/core/screens/notifications/config', () => ({
  novuApplicationIdentifier: 'testApplicationIdentifier',
}))

jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: () => mockUseLoggedInUser(),
}))

jest.mock('@holi/core/screens/notifications/hooks/useNovuCredentials', () => ({
  useNovuCredentials: () => ({
    hmacHash: 'someHmacHash',
    loading: false,
  }),
}))

jest.mock('@novu/client', () => ({
  ApiService: () => ({
    initializeSession: mockInitializeSession,
    setAuthorizationToken: mockSetAuthorizationToken,
  }),
}))

const mockConsoleWarn = jest.fn()
global.console.warn = mockConsoleWarn

describe('useNotificationService', () => {
  const subscriberId = 'testSubscriberId'
  const testError = new Error('test')

  beforeEach(() => {
    mockUseLoggedInUser.mockReturnValue({ user: { id: subscriberId } })
    mockInitializeSession.mockResolvedValue({ token: 'someToken' })
  })

  it('should expose loading flag while initializing', async () => {
    const { result } = renderHook(() => useNotificationService())

    expect(result.current.isInitializing).toBeTruthy()

    await waitFor(() => expect(result.current.isInitializing).toBeFalsy())
  })

  it('should handle error when initializing failed', async () => {
    mockInitializeSession.mockRejectedValue(testError)

    const { result } = renderHook(() => useNotificationService())

    expect(result.current.isInitializing).toBeTruthy()

    await waitFor(() => expect(result.current.isInitializing).toBeFalsy())
    expect(console.warn).toHaveBeenCalledWith(
      '[useNotificationService.initializeSession] Error initializing novu service',
      testError,
      {}
    )
  })

  it('should not initialize the novu service and session without logged in user', () => {
    mockUseLoggedInUser.mockReturnValue({})
    const { result } = renderHook(() => useNotificationService())

    expect(mockInitializeSession).not.toHaveBeenCalled()
    expect(result.current.isInitializing).toBeFalsy()
  })
})
