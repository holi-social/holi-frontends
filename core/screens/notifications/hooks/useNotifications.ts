import { IMessage, IPaginatedResponse } from '@novu/shared'
import { useCallback, useEffect, useRef, useState } from 'react'

import { logError, logErrorLocal } from '@holi/core/errors/helpers'
import { logDebug } from '@holi/core/helpers/logging'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import {
  Notification,
  NotificationPost,
  NotificationPostComment,
  NotificationSpaceConnection,
} from '@holi/core/screens/notifications/components/types'
import { useNotificationService } from '@holi/core/screens/notifications/hooks/useNotificationService'

const NOVU_NOTIFICATIONS_PAGE_SIZE = 10

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<{ [key: string]: Notification }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [canFetchMore, setCanFetchMore] = useState(true)
  const [nextPage, setNextPage] = useState(1)
  const { novuService, isInitializing } = useNotificationService()
  const notificationsMarkedAsSeen = useRef<string[]>([])

  const processMessagesResponse = useCallback(
    (response: IPaginatedResponse<IMessage>) =>
      setNotifications((notificationMap) => {
        const notifications = response.data
          .map(mapToNotification)
          .filter((notification) => !!notification) as Notification[]
        const newNotifications = Object.fromEntries(
          notifications.map((notification) => [notification.id, notification])
        )
        const hasNewNotifications = Object.keys(newNotifications).some((id) => !notificationMap[id])

        // Do not rerender when there are no new notifications
        if (!hasNewNotifications) {
          return notificationMap
        }
        return {
          ...notificationMap,
          ...newNotifications,
        }
      }),
    []
  )

  const fetchMessages = useCallback(
    async ({ pageToFetch, onSuccess }: { pageToFetch?: number; onSuccess?: () => void } = {}) =>
      novuService
        ?.getNotificationsList(pageToFetch || 0, {
          limit: NOVU_NOTIFICATIONS_PAGE_SIZE,
        })
        .then((response) => {
          onSuccess && onSuccess()
          setCanFetchMore(!!response.hasMore)
          processMessagesResponse(response)
        })
        .catch((error) =>
          logError(error, 'Error fetching notifications from novu', {
            location: 'useNotifications.fetchMessages',
          })
        ),
    [novuService, processMessagesResponse]
  )

  const fetchNextPage = useCallback(async () => {
    if (!novuService || isFetchingMore || !canFetchMore) {
      return
    }
    logDebug('useNotifications.fetchNextPage', 'start to fetch page', nextPage)
    setIsFetchingMore(true)
    return fetchMessages({ pageToFetch: nextPage }).finally(() => {
      setIsFetchingMore(false)
      setNextPage((currentPage) => currentPage + 1)
    })
  }, [canFetchMore, fetchMessages, isFetchingMore, nextPage, novuService])

  const markAllNotificationsAsSeen = useCallback(async () => {
    const messageIds = Object.values(notifications)
      .filter((notification) => !notification.read && !notificationsMarkedAsSeen.current.includes(notification.id))
      .map(({ id }) => id)
    if (!messageIds.length) {
      return
    }
    return novuService
      ?.markMessageAs(messageIds, { seen: true })
      .catch((error) =>
        logError(error, 'Error marking novu notifications as seen', {
          location: 'useNotifications.markAllNotificationsAsSeen',
          messageIds,
        })
      )
      .finally(() => {
        notificationsMarkedAsSeen.current = notificationsMarkedAsSeen.current.concat(messageIds)
      })
  }, [notifications, novuService])

  const refetch = useCallback(() => {
    return fetchMessages({
      onSuccess: () => {
        // Reset current state to replace previous messages
        setNotifications({})
        setNextPage(1)
      },
    })
  }, [fetchMessages])

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
    isFetchingMore,
    refetch,
  }
}

function mapToNotification(
  message: IMessage
): NotificationSpaceConnection | NotificationPostComment | NotificationPost | undefined {
  const { data, notificationType } = message.payload
  switch (notificationType) {
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_ADMIN:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_ADMIN:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_ADMIN:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_ADMIN:
      return {
        id: message._id,
        notificationType,
        created: message.createdAt,
        read: message.seen,
        options: data as NotificationSpaceConnection['options'],
        content: message.content.toString(),
      }
    case NovuNotificationType.POST_COMMENT_MENTION:
    case NovuNotificationType.POST_COMMENT_AUTHOR:
      return {
        id: message._id,
        notificationType,
        created: message.createdAt,
        read: message.seen,
        options: data as NotificationPostComment['options'],
        content: message.content.toString(),
      }
    case NovuNotificationType.SPACE_NEW_POST:
      return {
        id: message._id,
        notificationType,
        created: message.createdAt,
        read: message.seen,
        options: data as NotificationPost['options'],
        content: message.content.toString(),
      }
  }
  logErrorLocal(new Error("Couldn't map novu message"), 'Failed to map novu notification', {
    location: 'useNotifications.mapToNotification',
    message,
  })
}
