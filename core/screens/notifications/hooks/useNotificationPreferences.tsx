import { useMutation, useQuery } from '@apollo/client'
import { useCallback } from 'react'

import { updateNotificationsPreferences } from '@holi/core/screens/notifications/mutations'
import {
  NotificationsPreferencesResponse,
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
type EnabledValue = boolean | 'mixed' | undefined
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
  // TODO(SF) handle errors
  const { data, loading } = useQuery<NotificationsPreferencesResponse>(notificationsPreferencesQuery)
  const [updatePreferences, { loading: updatingPreferences }] =
    useMutation<NotificationsPreferencesResponse>(updateNotificationsPreferences)

  // const aggregatedGlobalPreferences = useMemo(
  //   () => aggregatePreferences(workflowPreferences, { allowMixed: true }),
  //   [workflowPreferences]
  // )
  // TODO(SF) handle chat preferences
  // const chatPreferencesGroup = {
  //   category: Group.CHAT,
  //   group: Group.CHAT,
  //   preferences: chatPreferences,
  // }
  // const updateChatPushPreferences = useCallback(async (enabled: boolean) =>
  // TODO(SF) what if chat client retrieval is not successful?
  // TODO(SF) update displayed state as well
  // getChatClient()
  //   .togglePushNotifications(enabled)
  //   .catch((error) =>
  //     logError(error, 'Error while updating chat push notification preferences', {
  //       location: 'useNotificationPreferences.updateChatPreferences',
  //     })
  //   ),
  //   []
  // )

  const updatePreference = useCallback(
    async (id: string, channel: Channel, enabled: boolean) => {
      await updatePreferences({
        variables: {
          input: {
            id,
            channel,
            enabled,
          },
        },
      })
    },
    [updatePreferences]
  )

  return {
    workflowPreferences: data?.notifications_preferences,
    updatePreference,
    loading,
    updatingPreferences,
  }
}
