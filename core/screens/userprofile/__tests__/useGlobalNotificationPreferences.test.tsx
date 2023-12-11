import { ApiService } from '@novu/client'
import { act, renderHook, waitFor } from '@testing-library/react-native'

import ChatClient from '@holi/chat/src/client/ChatClient'
import { logError } from '@holi/core/errors/helpers'
import { useGlobalNotificationPreferences } from '@holi/core/screens/userprofile/useGlobalNotificationPreferences'

const novuPreferences = [{ preference: { channels: { push: true, email: true } } }]
const novuPreferencesOnlyPush = { preference: { channels: { push: true, email: false } } }
const novuPreferencesOnlyEmail = { preference: { channels: { push: false, email: true } } }

let mockNovuService: Partial<ApiService>
let mockGetUserGlobalPreference = jest.fn()
const mockUpdateSubscriberGlobalPreference = jest.fn()

let mockChatClient: Partial<ChatClient>
let mockTogglePushNotifications = jest.fn()
jest.mock('@holi/chat/src/store', () => ({
  getChatClient: () => mockChatClient,
}))

jest.mock('@holi/core/screens/notifications/hooks/useNotificationService', () => ({
  useNotificationService: () => ({ novuService: mockNovuService, isInitializing: true }),
}))

jest.mock('@holi/core/errors/helpers', () => ({
  logError: jest.fn(),
}))

describe('useGlobalNotificationPreferences', () => {
  beforeEach(() => {
    mockChatClient = {
      togglePushNotifications: (value: boolean) => mockTogglePushNotifications(value),
    }
    mockNovuService = {
      getUserGlobalPreference: () => mockGetUserGlobalPreference(),
      updateSubscriberGlobalPreference: () => mockUpdateSubscriberGlobalPreference(),
    }
  })

  it('should fetch user global preferences initially', async () => {
    mockGetUserGlobalPreference = jest.fn().mockResolvedValue([novuPreferencesOnlyPush])

    const { result } = renderHook(() => useGlobalNotificationPreferences())

    await waitFor(() => {
      expect(result.current.globalPreferences).toEqual({ push: true, email: false })
      expect(result.current.globalPreferencesUpdating).toBeFalsy()
    })
  })

  it('should log error when initial fetch fails', async () => {
    mockNovuService = {
      getUserGlobalPreference: jest.fn().mockRejectedValue('broken'),
    }

    const { result } = renderHook(() => useGlobalNotificationPreferences())

    expect(result.current.globalPreferences).toStrictEqual(null)

    await waitFor(() => {
      // eslint-disable-next-line no-console
      expect(logError).toHaveBeenCalledWith(expect.stringContaining('broken'), expect.anything(), expect.anything())
    })
  })

  it('should disable email', async () => {
    mockNovuService = {
      getUserGlobalPreference: jest.fn().mockResolvedValue(novuPreferences),
      updateSubscriberGlobalPreference: jest.fn().mockResolvedValue(novuPreferencesOnlyPush),
    }

    const { result } = renderHook(() => useGlobalNotificationPreferences())

    await waitFor(() => {
      expect(result.current.globalPreferences).toBeTruthy()
    })

    act(() => {
      result.current.toggleEmailPreference(false)
    })

    await waitFor(() => {
      expect(mockNovuService.updateSubscriberGlobalPreference).toHaveBeenCalledWith(
        [
          { channelType: 'email', enabled: false },
          { channelType: 'push', enabled: true },
        ],
        true
      )
      expect(result.current).toStrictEqual(
        expect.objectContaining({
          globalPreferences: {
            email: false,
            push: true,
          },
          globalPreferencesUpdating: false,
        })
      )
    })
  })

  it('should disable push in novu and chat', async () => {
    // give a novu with only email preference
    mockNovuService = {
      getUserGlobalPreference: jest.fn().mockResolvedValue(novuPreferences),
      updateSubscriberGlobalPreference: jest.fn().mockResolvedValue(novuPreferencesOnlyEmail),
    }
    mockTogglePushNotifications = jest.fn().mockResolvedValue({})

    // when rendering
    const { result } = renderHook(() => useGlobalNotificationPreferences())

    // then we can wait to have some global preferences initially
    await waitFor(() => {
      expect(result.current.globalPreferences).toBeTruthy()
    })

    // when we toggle push off
    act(() => {
      result.current.togglePushPreference(false)
    })

    //then
    await waitFor(() => {
      // novu push is set to off
      expect(mockNovuService.updateSubscriberGlobalPreference).toHaveBeenCalledWith(
        [
          { channelType: 'email', enabled: true },
          { channelType: 'push', enabled: false },
        ],
        true
      )

      // matrix chat push is set to off
      waitFor(() => {
        expect(mockTogglePushNotifications).toHaveBeenCalledWith(false)
      })

      // the hook returns that push is off
      expect(result.current).toStrictEqual(
        expect.objectContaining({
          globalPreferences: {
            email: true,
            push: false,
          },
          globalPreferencesUpdating: false,
        })
      )
    })
  })

  it('should disable push in novu even if chat push disabling fails', async () => {
    mockNovuService = {
      getUserGlobalPreference: jest.fn().mockResolvedValue(novuPreferences),
      updateSubscriberGlobalPreference: jest.fn().mockResolvedValue(novuPreferencesOnlyEmail),
    }

    mockTogglePushNotifications = jest.fn().mockRejectedValue('chat server down')

    const { result } = renderHook(() => useGlobalNotificationPreferences())

    // wait to have some global preferences initially
    await waitFor(() => {
      expect(result.current.globalPreferences).toBeTruthy()
    })

    act(() => {
      result.current.togglePushPreference(false)
    })

    await waitFor(() => {
      expect(mockNovuService.updateSubscriberGlobalPreference).toHaveBeenCalledWith(
        [
          { channelType: 'email', enabled: true },
          { channelType: 'push', enabled: false },
        ],
        true
      )
    })
  })

  it('should log error for failing preferences update', async () => {
    mockNovuService = {
      getUserGlobalPreference: jest.fn().mockResolvedValue(novuPreferences),
      updateSubscriberGlobalPreference: jest.fn().mockRejectedValue('update failed'),
    }

    const { result } = renderHook(() => useGlobalNotificationPreferences())

    await waitFor(() => {
      expect(result.current.globalPreferences).toBeTruthy()
    })

    act(() => {
      result.current.togglePushPreference(false)
    })

    await waitFor(() => {
      // eslint-disable-next-line no-console
      expect(logError).toHaveBeenCalledWith(
        expect.stringContaining('update failed'),
        expect.anything(),
        expect.anything()
      )
    })
  })
})
