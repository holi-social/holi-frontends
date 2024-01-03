import { useMutation, useQuery } from '@apollo/client'
import { useCallback } from 'react'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useChatPushPreference } from '@holi/core/screens/notifications/hooks/useChatPushPreference'
import { updateNotificationsPreferences } from '@holi/core/screens/notifications/mutations'
import {
  NotificationsPreferencesResponse,
  NotificationsWorkflowPreferences,
  notificationsPreferencesQuery,
} from '@holi/core/screens/notifications/queries'

export enum Channel {
  PUSH = 'push',
  EMAIL = 'email',
}
export enum Category {
  GLOBAL = 'GLOBAL',
  CHAT = 'CHAT',
}
type EnabledValue = boolean | 'mixed' | null
export type NotificationChannelPreferences = { [key in Channel]?: EnabledValue }

export type UpdateWorkflowPreference = (id: string, channel: Channel, enabled: boolean) => Promise<void>

export interface NotificationWorkflow {
  id: string
  category: string
  preferences: NotificationChannelPreferences
}

// const determineEnabledValue = (
//   valueA: EnabledValue,
//   valueB: EnabledValue,
//   { allowMixed = false } = {}
// ): EnabledValue => {
//   if (valueA === undefined || valueA === valueB) {
//     return valueB
//   }
//   if (valueB === undefined) {
//     return valueA
//   }
//   return allowMixed ? 'mixed' : true
// }

// const aggregatePreferences = (workflows: NotificationWorkflow[], { allowMixed = false } = {}) =>
//   workflows.reduce(
//     (preferences, workflow) => ({
//       push: determineEnabledValue(preferences.push, workflow.preferences.push, { allowMixed }),
//       email: determineEnabledValue(preferences.email, workflow.preferences.email, { allowMixed }),
//     }),
//     {} as NotificationChannelPreferences
//   )

export const useNotificationPreferences = () => {
  const { displayError } = useErrorHandling()
  const {
    chatEnabled,
    chatPushEnabled,
    updateChatPushPreference,
    loadingChatPushPreference,
    updatingChatPushPreference,
  } = useChatPushPreference()
  const { data, loading } = useQuery<NotificationsPreferencesResponse>(notificationsPreferencesQuery, {
    onError: (error) =>
      displayError(error, 'Failed to load notification preferences', {
        location: 'useNotificationPreferences.notificationsPreferencesQuery',
      }),
  })
  const [updatePreferences, { loading: updatingPreferences }] = useMutation<NotificationsPreferencesResponse>(
    updateNotificationsPreferences,
    {
      onError: (error) =>
        displayError(error, 'Failed to update notification preferences', {
          location: 'useNotificationPreferences.updateNotificationsPreferences',
        }),
    }
  )

  const updatePreference = useCallback(
    async (id: string, channel: Channel, enabled: boolean) => {
      const updates = []
      if (([Category.GLOBAL, Category.CHAT] as string[]).includes(id) && channel === Channel.PUSH) {
        updates.push(updateChatPushPreference(enabled))
      }
      if (id !== Category.CHAT) {
        updates.push(
          updatePreferences({
            variables: {
              input: {
                id,
                channel,
                enabled,
              },
            },
          })
        )
      }
      await Promise.all(updates)
    },
    [updateChatPushPreference, updatePreferences]
  )

  // const aggregatedGlobalPreferences = useMemo(
  //   () => aggregatePreferences(workflowPreferences, { allowMixed: true }),
  //   [workflowPreferences]
  // )
  const chatPreferencesGroup: NotificationsWorkflowPreferences[] =
    chatEnabled && !loadingChatPushPreference
      ? [
          {
            id: Category.CHAT,
            category: Category.CHAT,
            preferences: {
              push: chatPushEnabled,
              email: null,
            },
          },
        ]
      : []

  return {
    workflowPreferences: data?.notifications_preferences?.concat(chatPreferencesGroup),
    updatePreference,
    loading: loading || loadingChatPushPreference,
    updatingPreferences: updatingPreferences || updatingChatPushPreference,
  }
}
