import { IMessage, IPaginatedResponse } from '@novu/shared'
import { useCallback, useEffect, useState } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import { Notification, NotificationSpaceConnection } from '@holi/core/screens/notifications/components/types'
import { useNotificationService } from '@holi/core/screens/notifications/hooks/useNotificationService'

const NOVU_NOTIFICATIONS_PAGE_TO_FETCH = 0

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { novuService, isInitializing } = useNotificationService()

  const shouldRerender = useCallback(
    (newNotifications: Notification[]) => {
      const hashA = notifications.map((n) => n.id).join('')
      const hashB = newNotifications.map((n) => n.id).join('')
      return hashA !== hashB
    },
    [notifications]
  )

  const processMessagesResponse = useCallback(
    (response: IPaginatedResponse<IMessage>) => {
      const notifications = mapToNotifications(response)
      if (shouldRerender(notifications)) {
        setNotifications(notifications)
      }
    },
    [shouldRerender]
  )

  const fetchMessages = useCallback(
    async (logFunction = logError) =>
      novuService
        ?.getNotificationsList(NOVU_NOTIFICATIONS_PAGE_TO_FETCH)
        .then(processMessagesResponse)
        .catch((error) =>
          logFunction(error, 'Error fetching notifications from novu', {
            location: 'useNotifications.fetchMessages',
          })
        ),
    [novuService, processMessagesResponse]
  )

  const markAllNotificationsAsSeen = useCallback(async () => {
    //all feeds
    const feedId = undefined
    return novuService?.markAllMessagesAsSeen(feedId).catch((error) =>
      logError(error, 'Error marking novu notifications as seen', {
        location: 'useNotifications.markAllNotificationsAsSeen',
      })
    )
  }, [novuService])

  useEffect(() => {
    if (novuService) {
      setIsLoading(true)
      fetchMessages().finally(() => setIsLoading(false))
    }
  }, [fetchMessages, novuService])

  return { notifications, isLoading: isLoading || isInitializing, markAllNotificationsAsSeen }
}

function mapToNotification(message: IMessage): NotificationSpaceConnection {
  if (message.payload.data) {
    const data = message.payload.data

    return {
      id: message._id,
      notificationType: NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
      created: message.createdAt,
      read: message.seen,
      options: data as NotificationSpaceConnection['options'],
    }
  }
  throw new Error("Couldn't map novu message")
}

function mapToNotifications(response: IPaginatedResponse<IMessage>) {
  const notifications: Notification[] = response.data.map((message) => mapToNotification(message))

  return notifications
}
