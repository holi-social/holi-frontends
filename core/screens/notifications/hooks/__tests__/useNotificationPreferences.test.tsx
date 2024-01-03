import { MockedProvider } from '@apollo/client/testing'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import React from 'react'

// import ChatClient from '@holi/chat/src/client/ChatClient'
import { logError } from '@holi/core/errors/helpers'
import {
  Channel,
  NotificationWorkflow,
  useNotificationPreferences,
} from '@holi/core/screens/notifications/hooks/useNotificationPreferences'
import { updateNotificationsPreferences } from '@holi/core/screens/notifications/mutations'
import { notificationsPreferencesQuery } from '@holi/core/screens/notifications/queries'

jest.mock('@holi/core/errors/helpers', () => {
  const original = jest.requireActual('@holi/core/errors/helpers')
  return {
    ...original,
    logError: jest.fn(),
  }
})

const addTypenamesToWorkflow = ({ preferences, ...workflow }: NotificationWorkflow) => ({
  ...workflow,
  preferences: {
    ...preferences,
    __typename: 'Notifications_ChannelPreferences',
  },
  __typename: 'Notifications_WorkflowPreferences',
})

const preferencesResponse = [
  {
    id: 'GLOBAL',
    category: 'GLOBAL',
    preferences: { push: false, email: true },
  },
  {
    id: 'SPACE_MEMBERSHIP_REQUEST',
    category: 'SPACES',
    preferences: { push: false, email: true },
  },
  {
    id: 'SPACE_NEW_POST',
    category: 'SPACES',
    preferences: { push: false, email: null },
  },
].map(addTypenamesToWorkflow)
const updatedPreferencesResponseGlobal = [
  {
    id: 'GLOBAL',
    category: 'GLOBAL',
    preferences: { push: false, email: false },
  },
  {
    id: 'SPACE_MEMBERSHIP_REQUEST',
    category: 'SPACES',
    preferences: { push: false, email: false },
  },
  {
    id: 'SPACE_NEW_POST',
    category: 'SPACES',
    preferences: { push: false, email: null },
  },
].map(addTypenamesToWorkflow)
const updatedPreferencesResponseWorkflow = [
  {
    id: 'GLOBAL',
    category: 'GLOBAL',
    preferences: { push: false, email: true },
  },
  {
    id: 'SPACE_MEMBERSHIP_REQUEST',
    category: 'SPACES',
    preferences: { push: false, email: false },
  },
  {
    id: 'SPACE_NEW_POST',
    category: 'SPACES',
    preferences: { push: false, email: null },
  },
].map(addTypenamesToWorkflow)
const preferencesRequestSuccess = {
  request: {
    query: notificationsPreferencesQuery,
  },
  result: {
    data: {
      notifications_preferences: preferencesResponse,
    },
  },
}
const preferencesRequestFailure = {
  request: {
    query: notificationsPreferencesQuery,
  },
  error: new Error('Test error'),
}
const updatePreferenceRequestGlobal = {
  request: {
    query: updateNotificationsPreferences,
    variables: {
      input: {
        id: 'GLOBAL',
        channel: 'email',
        enabled: false,
      },
    },
  },
  result: {
    data: {
      notifications_updatePreferences: updatedPreferencesResponseGlobal,
    },
  },
}
const updatePreferenceRequestWorkflow = {
  request: {
    query: updateNotificationsPreferences,
    variables: {
      input: {
        id: 'SPACE_MEMBERSHIP_REQUEST',
        channel: 'email',
        enabled: false,
      },
    },
  },
  result: {
    data: {
      notifications_updatePreferences: updatedPreferencesResponseWorkflow,
    },
  },
}
const updatePreferenceRequestFailure = {
  request: {
    query: updateNotificationsPreferences,
    variables: {
      input: {
        id: 'GLOBAL',
        channel: 'email',
        enabled: false,
      },
    },
  },
  error: new Error('Test error'),
}

// let mockChatClient: Partial<ChatClient>
// let mockTogglePushNotifications = jest.fn()
// jest.mock('@holi/chat/src/store', () => ({
//   getChatClient: () => mockChatClient,
// }))

describe('useNotificationPreferences', () => {
  beforeEach(() => {
    // mockChatClient = {
    //   togglePushNotifications: (value: boolean) => mockTogglePushNotifications(value),
    // }
  })

  it('should fetch user preferences initially', async () => {
    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: ({ children }) => <MockedProvider mocks={[preferencesRequestSuccess]}>{children}</MockedProvider>,
    })
    expect(result.current.loading).toBeTruthy()

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy()
      expect(result.current.workflowPreferences).toEqual(preferencesResponse)
    })
  })

  it('should log error when intitial fetch fails', async () => {
    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: ({ children }) => <MockedProvider mocks={[preferencesRequestFailure]}>{children}</MockedProvider>,
    })
    expect(result.current.loading).toBeTruthy()

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy()
      expect(result.current.workflowPreferences).toBeUndefined()
      expect(logError).toHaveBeenCalledWith(expect.anything(), 'Failed to load notification preferences', {
        location: 'useNotificationPreferences.notificationsPreferencesQuery',
      })
    })
  })

  it('should update global preference', async () => {
    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={[preferencesRequestSuccess, updatePreferenceRequestGlobal]}>{children}</MockedProvider>
      ),
    })
    await waitFor(() => {
      expect(result.current.loading).toBeFalsy()
    })

    await act(() => result.current.updatePreference('GLOBAL', Channel.EMAIL, false))

    await waitFor(() => {
      expect(result.current.updatingPreferences).toBeFalsy()
      expect(result.current.workflowPreferences).toEqual(updatedPreferencesResponseGlobal)
    })
  })

  it('should update workflow preference', async () => {
    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={[preferencesRequestSuccess, updatePreferenceRequestWorkflow]}>{children}</MockedProvider>
      ),
    })
    await waitFor(() => {
      expect(result.current.loading).toBeFalsy()
    })

    await act(() => result.current.updatePreference('SPACE_MEMBERSHIP_REQUEST', Channel.EMAIL, false))

    await waitFor(() => {
      expect(result.current.updatingPreferences).toBeFalsy()
      expect(result.current.workflowPreferences).toEqual(updatedPreferencesResponseWorkflow)
    })
  })

  it('should log error when updating preferences fails', async () => {
    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={[preferencesRequestSuccess, updatePreferenceRequestFailure]}>{children}</MockedProvider>
      ),
    })
    await waitFor(() => {
      expect(result.current.loading).toBeFalsy()
    })

    await act(() => result.current.updatePreference('GLOBAL', Channel.EMAIL, false))

    await waitFor(() => {
      expect(result.current.updatingPreferences).toBeFalsy()
      expect(result.current.workflowPreferences).toEqual(preferencesResponse)
      expect(logError).toHaveBeenCalledWith(expect.anything(), 'Failed to update notification preferences', {
        location: 'useNotificationPreferences.updateNotificationsPreferences',
      })
    })
  })

  // it('should disable push in novu and chat', async () => {
  //   // give a novu with only email preference
  //   mockNovuService = {
  //     getUserGlobalPreference: jest.fn().mockResolvedValue(novuPreferences),
  //     updateSubscriberGlobalPreference: jest.fn().mockResolvedValue(novuPreferencesOnlyEmail),
  //   }
  //   mockTogglePushNotifications = jest.fn().mockResolvedValue({})

  //   // when rendering
  //   const { result } = renderHook(() => useNotificationPreferences())

  //   // then we can wait to have some global preferences initially
  //   await waitFor(() => {
  //     expect(result.current.globalPreferences).toBeTruthy()
  //   })

  //   // when we toggle push off
  //   act(() => {
  //     result.current.togglePushPreference(false)
  //   })

  //   //then
  //   await waitFor(() => {
  //     // novu push is set to off
  //     expect(mockNovuService.updateSubscriberGlobalPreference).toHaveBeenCalledWith(
  //       [
  //         { channelType: 'email', enabled: true },
  //         { channelType: 'push', enabled: false },
  //       ],
  //       true
  //     )

  //     // matrix chat push is set to off
  //     waitFor(() => {
  //       expect(mockTogglePushNotifications).toHaveBeenCalledWith(false)
  //     })

  //     // the hook returns that push is off
  //     expect(result.current).toStrictEqual(
  //       expect.objectContaining({
  //         globalPreferences: {
  //           email: true,
  //           push: false,
  //         },
  //         globalPreferencesUpdating: false,
  //       })
  //     )
  //   })
  // })

  // it('should disable push in novu even if chat push disabling fails', async () => {
  //   mockNovuService = {
  //     getUserGlobalPreference: jest.fn().mockResolvedValue(novuPreferences),
  //     updateSubscriberGlobalPreference: jest.fn().mockResolvedValue(novuPreferencesOnlyEmail),
  //   }

  //   mockTogglePushNotifications = jest.fn().mockRejectedValue('chat server down')

  //   const { result } = renderHook(() => useNotificationPreferences())

  //   // wait to have some global preferences initially
  //   await waitFor(() => {
  //     expect(result.current.globalPreferences).toBeTruthy()
  //   })

  //   act(() => {
  //     result.current.togglePushPreference(false)
  //   })

  //   await waitFor(() => {
  //     expect(mockNovuService.updateSubscriberGlobalPreference).toHaveBeenCalledWith(
  //       [
  //         { channelType: 'email', enabled: true },
  //         { channelType: 'push', enabled: false },
  //       ],
  //       true
  //     )
  //    // TODO(SF) expect error log
  //   })
  // })
})
