import { HeadlessService, IFeedId } from '@novu/headless'
import { IMessage, IPaginatedResponse } from '@novu/shared'
import { useCallback, useEffect, useRef, useState } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { Notification, NotificationType } from '@holi/core/screens/notifications/components/types'
import { novuApplicationIdentifier, novuBackendUrl, novuSocketUrl } from '@holi/core/screens/notifications/config'
import { novuTokenStorage } from '@holi/core/screens/notifications/hooks/novuTokenStorage'
import { UserConnectionStatus } from '@holi/core/screens/userprofile/types'

const NOVU_NOTIFICATIONS_PAGE_TO_FETCH = 0

export const useNotifications = (subscriberId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isFetching, setIsFetching] = useState(false)

  const headlessServiceRef = useRef<HeadlessService | null>(null)

  const fetchNotificationsInitially = useCallback(() => {
    const headlessService = headlessServiceRef.current

    if (headlessService) {
      headlessService.fetchNotifications({
        listener: (result) => {
          setIsFetching(result.isFetching)
        },
        onSuccess: (response) => {
          const notifications = mapToNotifications(response)
          setNotifications(notifications)
        },
        onError: (error) =>
          logError(error, 'Error fetching notifications', {
            location: 'useNotifications.fetchNotifications',
          }),
        page: NOVU_NOTIFICATIONS_PAGE_TO_FETCH,
      })
    }
  }, [])

  const startListeningForNotifications = useCallback(() => {
    const headlessService = headlessServiceRef.current

    if (headlessService) {
      headlessService.listenNotificationReceive({
        listener: (message: IMessage) => {
          setNotifications((currentNotifications) => {
            return [...currentNotifications, mapToNotification(message)]
          })
        },
      })
    }
  }, [])

  useEffect(() => {
    if (!subscriberId) return () => ({})

    const headlessService = new HeadlessService({
      applicationIdentifier: novuApplicationIdentifier,
      backendUrl: novuBackendUrl,
      socketUrl: novuSocketUrl,
      subscriberId: subscriberId,
      tokenStorage: novuTokenStorage,
    })

    headlessServiceRef.current = headlessService

    return headlessService.initializeSession({
      listener: () => ({}),
      onSuccess: () => {
        headlessServiceRef.current = headlessService
        fetchNotificationsInitially()
        startListeningForNotifications()
      },
      onError: (error) =>
        logError(error, 'Error initializing notifications session', {
          location: 'useNotifications.initializeSession',
        }),
    })
  }, [fetchNotificationsInitially, startListeningForNotifications, subscriberId])

  const markAllNotificationsAsRead = (feedId?: IFeedId) => {
    const headlessService = headlessServiceRef.current

    if (headlessService) {
      headlessService.markAllMessagesAsRead({
        listener: () => ({}),
        onError: (error) =>
          logError(error, 'Error marking all notifications as read', {
            location: 'useNotifications.markAllMessagesAsRead',
          }),
        feedId,
      })
    }
  }

  return { notifications, markAllNotificationsAsRead, isFetching }
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
