import { act, renderHook, waitFor } from 'expo-router/testing-library'

import { logError } from '@holi/core/errors/helpers'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useChatPushPreference } from '@holi/core/screens/notifications/hooks/useChatPushPreference'

const mockGetChatClient = jest.fn()
const mockGetPushNotificationEnabledState = jest.fn()
const mockSetPushNotificationsEnabled = jest.fn()
const mockUseFeatureFlag = jest.fn()
const mockUseChatInitialized = jest.fn()

jest.mock('@holi/core/errors/helpers', () => ({
  logError: jest.fn(),
}))

jest.mock('@holi/chat/src/store', () => ({
  getChatClient: () => mockGetChatClient(),
}))

jest.mock('@holi/chat/src/client/chatState', () => ({
  useChatInitialized: () => mockUseChatInitialized(),
}))

jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flag: FeatureFlagKey) => mockUseFeatureFlag(flag),
}))

describe('useChatPushPreference', () => {
  beforeEach(() => {
    mockUseFeatureFlag.mockReturnValue(['on', undefined])
    mockUseChatInitialized.mockReturnValue(true)
    mockGetPushNotificationEnabledState.mockResolvedValue(true)
    mockSetPushNotificationsEnabled.mockResolvedValue(null)
    mockGetChatClient.mockReturnValue({
      getPushNotificationEnabledState: mockGetPushNotificationEnabledState,
      setPushNotificationsEnabled: mockSetPushNotificationsEnabled,
    })
  })

  it('should return loading state while initializing the chat', () => {
    mockUseChatInitialized.mockReturnValueOnce(false)
    const { result } = renderHook(() => useChatPushPreference())

    expect(result.current.loadingChatPushPreference).toBeTruthy()
  })

  it('should expose if chat feature toggle is enabled', async () => {
    const { result } = renderHook(() => useChatPushPreference())

    await waitFor(() => expect(result.current.loadingChatPushPreference).toBeFalsy())

    expect(result.current.chatEnabled).toBeTruthy()
  })

  it('should fetch and expose push preference', async () => {
    const { result } = renderHook(() => useChatPushPreference())

    expect(result.current.loadingChatPushPreference).toBeTruthy()

    await waitFor(() => expect(result.current.loadingChatPushPreference).toBeFalsy())
    expect(result.current.chatPushEnabled).toBeTruthy()
  })

  it('should log error if fetching the push preference fails', async () => {
    mockGetPushNotificationEnabledState.mockRejectedValueOnce(new Error('Test'))

    const { result } = renderHook(() => useChatPushPreference())

    await waitFor(() => expect(result.current.loadingChatPushPreference).toBeFalsy())
    expect(logError).toHaveBeenCalledWith(
      expect.anything(),
      'Error while fetching chat push notification preferences',
      {
        location: 'useChatPushPreferences.getPushNotificationEnabledState',
      }
    )
  })

  it('should update push preference', async () => {
    const { result } = renderHook(() => useChatPushPreference())

    await act(() => result.current.updateChatPushPreference(false))

    expect(mockSetPushNotificationsEnabled).toHaveBeenCalledWith(false)
  })

  it('should log error if updating push preference fails', async () => {
    mockSetPushNotificationsEnabled.mockRejectedValueOnce(new Error('Test'))

    const { result } = renderHook(() => useChatPushPreference())

    await act(() => result.current.updateChatPushPreference(false))

    expect(logError).toHaveBeenCalledWith(
      expect.anything(),
      'Error while updating chat push notification preferences',
      { location: 'useChatPushPreferences.updateChatPreferences' }
    )
  })

  it('should ignore preference update if chat is not enabled', async () => {
    mockUseFeatureFlag.mockReturnValueOnce({ ftEnabled: false })
    const { result } = renderHook(() => useChatPushPreference())

    expect(result.current.chatEnabled).toBeFalsy()

    await act(() => result.current.updateChatPushPreference(false))

    expect(mockSetPushNotificationsEnabled).not.toHaveBeenCalled()
  })
})
