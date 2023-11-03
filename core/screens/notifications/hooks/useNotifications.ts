import { IMessage, IPaginatedResponse } from '@novu/shared'
import { useCallback, useEffect, useState } from 'react'

import { logError, logErrorLocal } from '@holi/core/errors/helpers'
import { logDebug } from '@holi/core/helpers/logging'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import { Notification, NotificationSpaceConnection } from '@holi/core/screens/notifications/components/types'
import { useNotificationService } from '@holi/core/screens/notifications/hooks/useNotificationService'

const NOVU_NOTIFICATIONS_PAGE_SIZE = 10

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<{ [key: string]: Notification }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [canFetchMore, setCanFetchMore] = useState(true)
  const [nextPage, setNextPage] = useState(1)

  const { novuService, isInitializing } = useNotificationService()

  const processMessagesResponse = useCallback(
    (response: IPaginatedResponse<IMessage>) =>
      setNotifications((notificationMap) => {
        const notifications = response.data.map((message) => mapToNotification(message))
        const hasNewNotifications = notifications.some(
          (notification) => notification && !notificationMap[notification.id]
        )
        // Do not rerender when there are no new notifications
        if (!hasNewNotifications) {
          return notificationMap
        }
        return notifications.reduce((previousMap, notification) => {
          if (notification) {
            return {
              ...previousMap,
              [notification.id]: notification,
            }
          }
          return previousMap
        }, notificationMap)
      }),
    []
  )

  const fetchMessages = useCallback(
    async (pageToFetch = 0, logFunction = logError) =>
      novuService
        ?.getNotificationsList(pageToFetch, {
          limit: NOVU_NOTIFICATIONS_PAGE_SIZE,
        })
        .then((response) => {
          if (!response.hasMore) {
            setCanFetchMore(false)
          }
          processMessagesResponse(response)
        })
        .catch((error) =>
          logFunction(error, 'Error fetching notifications from novu', {
            location: 'useNotifications.fetchMessages',
          })
        ),
    [novuService, processMessagesResponse]
  )

  const fetchNextPage = useCallback(async () => {
    if (!novuService || isFetchingMore) {
      return
    }
    logDebug('useNotifications.fetchNextPage', 'start to fetch page', nextPage)
    setIsFetchingMore(true)
    return fetchMessages(nextPage).finally(() => {
      setIsFetchingMore(false)
      setNextPage((currentState) => currentState + 1)
    })
  }, [fetchMessages, isFetchingMore, nextPage, novuService])

  const markAllNotificationsAsSeen = useCallback(async () => {
    const messageIds = Object.values(notifications)
      .filter((notification) => !notification.read)
      .map(({ id }) => id)
    if (!messageIds.length) {
      return
    }
    return novuService?.markMessageAs(messageIds, { seen: true }).catch((error) =>
      logError(error, 'Error marking novu notifications as seen', {
        location: 'useNotifications.markAllNotificationsAsSeen',
        messageIds,
      })
    )
  }, [notifications, novuService])

  useEffect(() => {
    if (novuService) {
      setIsLoading(true)
      fetchMessages().finally(() => setIsLoading(false))
    }
  }, [fetchMessages, novuService])

  return {
    notifications: Object.values(notifications),
    isLoading: isLoading || isInitializing,
    markAllNotificationsAsSeen,
    canFetchMore,
    fetchNextPage,
  }
}

function mapToNotification(message: IMessage): NotificationSpaceConnection | undefined {
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
  logErrorLocal(new Error("Couldn't map novu message"), 'Failed to map novu notification', {
    location: 'useNotifications.mapToNotification',
    message,
  })
}
