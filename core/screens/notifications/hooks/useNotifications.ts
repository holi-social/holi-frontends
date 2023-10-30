import { IMessage, IPaginatedResponse } from '@novu/shared'
import { useCallback, useEffect, useState } from 'react'

import { logError, logErrorLocal } from '@holi/core/errors/helpers'
import { Notification, NotificationType } from '@holi/core/screens/notifications/components/types'
import { notificationPollingInterval } from '@holi/core/screens/notifications/config'
import { useNotificationService } from '@holi/core/screens/notifications/hooks/useNotificationService'
import { UserConnectionStatus } from '@holi/core/screens/userprofile/types'

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
    let fetchIntervalId: NodeJS.Timer | null = null

    const fetchMessagesContinually = () => {
      fetchIntervalId = setInterval(() => {
        // Only log errors locally without sending sentry reports
        fetchMessages(logErrorLocal)
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

  return { notifications, isLoading: isLoading || isInitializing, markAllNotificationsAsSeen }
}

function mapToNotification(message: IMessage): Notification {
  // todo gregor: map notifications correctly and don't just use a wrong static type
  return {
    notificationType: NotificationType.CONNECTION_ACCEPTED,
    created: message.createdAt,
    id: message._id,
    owner: {
      aboutMe: '',
      avatar: '',
      avatarBlurhash: '',
      avatarDefaultColor: '',
      avatarLabel: '',
      connectionStatusToMyself: UserConnectionStatus.CONNECTED,
      connectionStatusToSpace: [],
      engagementLevel: '',
      firstName: '',
      fullName: '',
      geolocationId: '',
      id: '',
      identity: '',
      interests: [],
      lastName: '',
      location: '',
      pronouns: '',
      sdgs: [],
      skills: [],
    },
    read: message.read,
    options: {
      user: {
        aboutMe: '',
        avatar: '',
        avatarBlurhash: '',
        avatarDefaultColor: '',
        avatarLabel: '',
        connectionStatusToMyself: UserConnectionStatus.CONNECTED,
        connectionStatusToSpace: [],
        engagementLevel: '',
        firstName: '',
        fullName: message.content.toString(),
        geolocationId: '',
        id: '',
        identity: '',
        interests: [],
        lastName: '',
        location: '',
        pronouns: '',
        sdgs: [],
        skills: [],
      },
    },
  }
}

function mapToNotifications(response: IPaginatedResponse<IMessage>) {
  const notifications: Notification[] = response.data.map((message) => mapToNotification(message))

  return notifications
}
