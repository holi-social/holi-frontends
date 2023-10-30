/* eslint-disable no-console */
import { ApiService } from '@novu/client'
import { renderHook, waitFor } from '@testing-library/react-native'

import { useNotificationService } from '@holi/core/screens/notifications/hooks/useNotificationService'

const mockInitializeSession = jest.fn()
const mockSetAuthorizationToken = jest.fn()
const mockUseLoggedInUser = jest.fn()
const mockUseFeatureToggle = jest.fn()

jest.mock('@holi/core/screens/notifications/config', () => ({
  novuApplicationIdentifier: 'testApplicationIdentifier',
}))

jest.mock('@holi/core/screens/userprofile/useLoggedInUser', () => ({
  useLoggedInUser: () => mockUseLoggedInUser(),
}))

jest.mock('@holi/core/helpers/useFeatureToggle', () => ({
  useFeatureToggle: () => mockUseFeatureToggle(),
  FeatureToggleName: {
    NOTIFICATIONS: 'NOTIFICATIONS',
  },
}))

jest.mock('@novu/client')

const mockConsoleWarn = jest.fn()
global.console.warn = mockConsoleWarn

describe('useNotificationService', () => {
  const subscriberId = 'testSubscriberId'
  const testError = new Error('test')

  beforeEach(() => {
    mockUseLoggedInUser.mockReturnValue({ user: { id: subscriberId } })
    mockUseFeatureToggle.mockReturnValue({ ftEnabled: true })
    mockInitializeSession.mockResolvedValue({ token: 'someToken' })
    // @ts-ignore
    jest.mocked(ApiService).mockImplementation(() => ({
      initializeSession: mockInitializeSession,
      setAuthorizationToken: mockSetAuthorizationToken,
    }))
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

    expect(ApiService).not.toHaveBeenCalled()
    expect(mockInitializeSession).not.toHaveBeenCalled()
    expect(result.current.isInitializing).toBeFalsy()
  })

  it('should not initialize the novu service and session if the feature toggle is disabled', () => {
    mockUseFeatureToggle.mockReturnValue({ ftEnabled: false })
    const { result } = renderHook(() => useNotificationService())

    expect(ApiService).not.toHaveBeenCalled()
    expect(mockInitializeSession).not.toHaveBeenCalled()
    expect(result.current.isInitializing).toBeFalsy()
  })
})
