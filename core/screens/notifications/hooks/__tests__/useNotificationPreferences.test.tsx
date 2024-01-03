import { MockedProvider } from '@apollo/client/testing'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import React from 'react'

import { logError } from '@holi/core/errors/helpers'
import {
  Channel,
  NotificationWorkflow,
  useNotificationPreferences,
} from '@holi/core/screens/notifications/hooks/useNotificationPreferences'
import { updateNotificationsPreferences } from '@holi/core/screens/notifications/mutations'
import {
  NotificationsWorkflowPreferences,
  notificationsPreferencesQuery,
} from '@holi/core/screens/notifications/queries'

const mockUseChatPushPreference = jest.fn()

jest.mock('@holi/core/errors/helpers', () => {
  const original = jest.requireActual('@holi/core/errors/helpers')
  return {
    ...original,
    logError: jest.fn(),
  }
})

jest.mock('@holi/core/screens/notifications/hooks/useChatPushPreference', () => ({
  useChatPushPreference: () => mockUseChatPushPreference(),
}))

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
const updatePreferenceRequestGlobalPush = {
  request: {
    query: updateNotificationsPreferences,
    variables: {
      input: {
        id: 'GLOBAL',
        channel: 'push',
        enabled: true,
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

describe('useNotificationPreferences', () => {
  beforeEach(() => {
    mockUseChatPushPreference.mockReturnValue({
      chatEnabled: false,
    })
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

  it('should handle chat push preference loading state', async () => {
    mockUseChatPushPreference.mockReturnValue({
      loadingChatPushPreference: true,
    })
    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: ({ children }) => <MockedProvider mocks={[preferencesRequestSuccess]}>{children}</MockedProvider>,
    })

    await waitFor(() => expect(result.current.workflowPreferences).toEqual(preferencesResponse))

    expect(result.current.loading).toBeTruthy()
  })

  it('should include chat push preference if chat is enabled', async () => {
    const expectedPreferences = (preferencesResponse as NotificationsWorkflowPreferences[]).concat([
      {
        id: 'CHAT',
        category: 'CHAT',
        preferences: { push: true, email: null },
      },
    ])
    mockUseChatPushPreference.mockReturnValue({
      chatEnabled: true,
      chatPushEnabled: true,
    })
    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: ({ children }) => <MockedProvider mocks={[preferencesRequestSuccess]}>{children}</MockedProvider>,
    })
    expect(result.current.loading).toBeTruthy()

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy()
      expect(result.current.workflowPreferences).toEqual(expectedPreferences)
    })
  })

  it('should apply global push preference to chat', async () => {
    const updateChatPushPreference = jest.fn().mockResolvedValue(null)
    mockUseChatPushPreference.mockReturnValue({
      chatEnabled: true,
      updateChatPushPreference,
    })
    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={[preferencesRequestSuccess, updatePreferenceRequestGlobalPush]}>
          {children}
        </MockedProvider>
      ),
    })
    await waitFor(() => {
      expect(result.current.loading).toBeFalsy()
    })

    await act(() => result.current.updatePreference('GLOBAL', Channel.PUSH, true))

    await waitFor(() => {
      expect(result.current.updatingPreferences).toBeFalsy()
      expect(updateChatPushPreference).toHaveBeenCalledWith(true)
    })
  })

  it('should not apply global email preference to chat', async () => {
    const updateChatPushPreference = jest.fn()
    mockUseChatPushPreference.mockReturnValue({
      chatEnabled: true,
      updateChatPushPreference,
    })
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
      expect(updateChatPushPreference).not.toHaveBeenCalled()
    })
  })

  it('should apply chat push preference update', async () => {
    const updateChatPushPreference = jest.fn().mockResolvedValue(null)
    mockUseChatPushPreference.mockReturnValue({
      chatEnabled: true,
      updateChatPushPreference,
    })
    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: ({ children }) => <MockedProvider mocks={[preferencesRequestSuccess]}>{children}</MockedProvider>,
    })
    await waitFor(() => {
      expect(result.current.loading).toBeFalsy()
    })

    await act(() => result.current.updatePreference('CHAT', Channel.PUSH, true))

    await waitFor(() => {
      expect(result.current.updatingPreferences).toBeFalsy()
      expect(updateChatPushPreference).toHaveBeenCalledWith(true)
    })
  })
})
