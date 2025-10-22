import { useMutation, useQuery } from '@apollo/client'
import { useCallback, useMemo, useState } from 'react'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useChatPushPreference } from '@holi/core/screens/notifications/hooks/useChatPushPreference'
import { updateNotificationsPreferences } from '@holi/core/screens/notifications/mutations'
import {
  type NotificationsPreferencesResponse,
  type NotificationsWorkflowPreferences,
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
export type NotificationWorkflowPreferences = { [key in Channel]: EnabledValue }
export type NotificationWorkflow = Omit<NotificationsWorkflowPreferences, 'preferences'> & {
  preferences: NotificationWorkflowPreferences
}

export type UpdateWorkflowPreference = (id: string, channel: Channel, enabled: boolean) => Promise<void>

const determineMixedEnabledValue = (valueA: EnabledValue, valueB: EnabledValue): EnabledValue => {
  if (valueA === null || valueA === valueB) {
    return valueB
  }
  if (valueB === null) {
    return valueA
  }
  return 'mixed'
}

const aggregateMixedPreferences = (workflows: NotificationsWorkflowPreferences[]) =>
  workflows.reduce(
    (preferences, workflow) => ({
      push: determineMixedEnabledValue(preferences.push, workflow.preferences.push),
      email: determineMixedEnabledValue(preferences.email, workflow.preferences.email),
    }),
    { push: null, email: null } as NotificationWorkflowPreferences
  )

const createChatPreferences = (
  includeChat?: boolean,
  chatPushEnabled?: boolean
): NotificationsWorkflowPreferences | undefined =>
  includeChat
    ? {
        id: Category.CHAT,
        category: Category.CHAT,
        preferences: {
          push: !!chatPushEnabled,
          email: null,
        },
      }
    : undefined

const combineAndAggregatePreferences = (
  workflowPreferences?: NotificationsWorkflowPreferences[],
  chatPreferences?: NotificationsWorkflowPreferences
): NotificationWorkflow[] | undefined => {
  if (workflowPreferences === undefined) {
    return workflowPreferences
  }
  const nonGlobalPreferences = workflowPreferences.filter(({ id }) => id !== Category.GLOBAL)
  const workflowsToAggregate = chatPreferences ? nonGlobalPreferences.concat([chatPreferences]) : nonGlobalPreferences

  const aggregatedGlobalPreferences = {
    id: Category.GLOBAL,
    category: Category.GLOBAL,
    preferences: aggregateMixedPreferences(workflowsToAggregate),
  } as NotificationWorkflow
  return [aggregatedGlobalPreferences].concat(workflowsToAggregate)
}

export const useNotificationPreferences = () => {
  const { displayError } = useErrorHandling()
  const [updatingPreferences, setUpdatingPreferences] = useState(false)
  const { chatEnabled, chatPushEnabled, updateChatPushPreference, loadingChatPushPreference } = useChatPushPreference()
  const { data, loading } = useQuery<NotificationsPreferencesResponse>(notificationsPreferencesQuery, {
    fetchPolicy: 'network-only',
    onError: (error) =>
      displayError(error, 'Failed to load notification preferences', {
        location: 'useNotificationPreferences.notificationsPreferencesQuery',
      }),
  })
  const [updatePreferences] = useMutation<NotificationsPreferencesResponse>(updateNotificationsPreferences, {
    onError: (error) =>
      displayError(error, 'Failed to update notification preferences', {
        location: 'useNotificationPreferences.updateNotificationsPreferences',
      }),
  })

  const updatePreference = useCallback(
    async (id: string, channel: Channel, enabled: boolean) => {
      setUpdatingPreferences(true)
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
      await Promise.all(updates).finally(() => setUpdatingPreferences(false))
    },
    [updateChatPushPreference, updatePreferences]
  )

  const chatPreferences = useMemo(
    () => createChatPreferences(chatEnabled && !loadingChatPushPreference, chatPushEnabled),
    [chatEnabled, chatPushEnabled, loadingChatPushPreference]
  )
  const workflowPreferences = useMemo(
    () => combineAndAggregatePreferences(data?.notifications_preferences, chatPreferences),
    [chatPreferences, data?.notifications_preferences]
  )

  return {
    workflowPreferences,
    updatePreference,
    loading: loading || loadingChatPushPreference,
    updatingPreferences: updatingPreferences,
  }
}
