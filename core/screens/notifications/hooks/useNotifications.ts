import { ApiService } from '@novu/client'
import { IMessage, IPaginatedResponse } from '@novu/shared'
import { useCallback, useEffect, useRef, useState } from 'react'

import { logError, logErrorLocal } from '@holi/core/errors/helpers'
import { Notification, NotificationType } from '@holi/core/screens/notifications/components/types'
import { novuApplicationIdentifier, novuBackendUrl } from '@holi/core/screens/notifications/config'
import { UserConnectionStatus } from '@holi/core/screens/userprofile/types'

const NOVU_NOTIFICATIONS_PAGE_TO_FETCH = 0
const DEFAULT_REFETCH_INTERVAL_IN_MILLIS = 10000

export const useNotifications = (
  subscriberId?: string,
  refetchInterval: number | undefined = DEFAULT_REFETCH_INTERVAL_IN_MILLIS
) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const novuServiceRef = useRef<ApiService | null>(null)

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
    (logFunction = logError) => {
      const novu = novuServiceRef.current
      if (novu) {
        return novu
          .getNotificationsList(NOVU_NOTIFICATIONS_PAGE_TO_FETCH)
          .then(processMessagesResponse)
          .catch((error) =>
            logFunction(error, 'Error fetching notifications from novu', {
              location: 'useNotifications.fetchMessages',
            })
          )
      }
    },
    [processMessagesResponse]
  )

  const markAllNotificationsAsSeen = useCallback(async () => {
    const novu = novuServiceRef.current
    if (novu) {
      //all feeds
      const feedId = undefined
      return novu.markAllMessagesAsSeen(feedId).catch((error) =>
        logError(error, 'Error marking novu notifications as seen', {
          location: 'useNotifications.markAllNotificationsAsSeen',
        })
      )
    }
  }, [])

  useEffect(() => {
    let fetchIntervalId: number | null = null

    const fetchMessagesContinually = () => {
      // @ts-ignore
      // return type inference for setInterval is wrong in Pycharm Pro
      fetchIntervalId = setInterval(() => {
        // Only log errors locally without sending sentry reports
        fetchMessages(logErrorLocal)
      }, refetchInterval)
    }

    if (subscriberId) {
      setIsLoading(true)
      const novuService = new ApiService(novuBackendUrl)
      novuService
        .initializeSession(novuApplicationIdentifier, subscriberId)
        .then((session) => {
          novuService.setAuthorizationToken(session.token)
          novuServiceRef.current = novuService

          fetchMessagesContinually()
          return fetchMessages()
        })
        .finally(() => setIsLoading(false))

      return () => {
        if (fetchIntervalId) {
          clearInterval(fetchIntervalId)
        }
      }
    }
  }, [fetchMessages, subscriberId, refetchInterval, markAllNotificationsAsSeen])

  return { notifications, isLoading, markAllNotificationsAsSeen }
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
