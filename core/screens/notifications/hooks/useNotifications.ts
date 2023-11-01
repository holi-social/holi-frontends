import { IMessage, IPaginatedResponse } from '@novu/shared'
import { useCallback, useEffect, useState } from 'react'

import { logError, logErrorLocal } from '@holi/core/errors/helpers'
import { logDebug } from '@holi/core/helpers/logging'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import { Notification, NotificationSpaceConnection } from '@holi/core/screens/notifications/components/types'
import { notificationPollingInterval } from '@holi/core/screens/notifications/config'
import { useNotificationService } from '@holi/core/screens/notifications/hooks/useNotificationService'

const NOVU_NOTIFICATIONS_PAGE_SIZE = 10

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<{ [key: string]: Notification }>({})
  const [isLoading, setIsLoading] = useState(false)
  // TODO(SF) necessary?
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [canFetchMore, setCanFetchMore] = useState(true)
  const [nextPage, setNextPage] = useState(1)

  const { novuService, isInitializing } = useNotificationService()

  const processMessagesResponse = useCallback(
    (response: IPaginatedResponse<IMessage>) =>
      setNotifications((notificationMap) => {
        return response.data
          .map((message) => mapToNotification(message))
          .reduce((previousMap, notification) => {
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
    // TODO(SF) only mark notifications as seen that were already fetched
    //all feeds
    const feedId = undefined
    return novuService?.markAllMessagesAsSeen(feedId).catch((error) =>
      logError(error, 'Error marking novu notifications as seen', {
        location: 'useNotifications.markAllNotificationsAsSeen',
      })
    )
  }, [novuService])

  useEffect(() => {
    let fetchIntervalId: NodeJS.Timer | null = null

    const fetchMessagesContinually = () => {
      fetchIntervalId = setInterval(() => {
        // TODO(SF) filter for unseen? maybe even with limit 100?
        // TODO(SF) only append to list, do not replace => do not use fetchMessages
        // TODO(SF) how to handle deleted messages? => maybe only compare first page? but what about invalid messages? :/
        // Only log errors locally without sending sentry reports
        fetchMessages(0, logErrorLocal)
      }, notificationPollingInterval)
    }

    if (novuService) {
      setIsLoading(true)
      fetchMessages().finally(() => setIsLoading(false))
      fetchMessagesContinually()

      return () => {
        if (fetchIntervalId) {
          clearInterval(fetchIntervalId)
        }
      }
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
