import { HeadlessService, IFeedId } from '@novu/headless'
import { IMessage, IPaginatedResponse } from '@novu/shared'
import { useCallback, useEffect, useRef, useState } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { Notification, NotificationType } from '@holi/core/screens/notifications/components/types'
import { novuApplicationIdentifier, novuBackendUrl, novuSocketUrl } from '@holi/core/screens/notifications/config'
import { UserConnectionStatus } from '@holi/core/screens/userprofile/types'

const NOVU_NOTIFICATIONS_PAGE_TO_FETCH = 0

export const useNotifications = (subscriberId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isFetching, setIsFetching] = useState(false)

  const headlessServiceRef = useRef<HeadlessService | null>(null)

  const fetchNotifications = useCallback(() => {
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

  useEffect(() => {
    if (!subscriberId) return () => ({})

    const headlessService = new HeadlessService({
      applicationIdentifier: novuApplicationIdentifier,
      backendUrl: novuBackendUrl,
      socketUrl: novuSocketUrl,
      subscriberId: subscriberId,
      tokenStorage: {
        //todo gregor - use localStorage default for web and only provide this hack for mobile
        getItem: () => {
          // @ts-ignore:next-line
          return global.novuToken ?? null
        },
        removeItem: () => {
          // @ts-ignore:next-line
          delete global.novuToken
        },
        setItem: (_, value) => {
          // @ts-ignore:next-line
          global.novuToken = value
        },
      },
    })

    headlessServiceRef.current = headlessService

    return headlessService.initializeSession({
      listener: () => ({}),
      onSuccess: () => {
        headlessServiceRef.current = headlessService
        fetchNotifications()
      },
      onError: (error) =>
        logError(error, 'Error initializing notifications session', {
          location: 'useNotifications.initializeSession',
        }),
    })
  }, [fetchNotifications, subscriberId])

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

function mapToNotifications(response: IPaginatedResponse<IMessage>) {
  // todo gregor: map notifications correctly and don't just use a wrong static type
  const notifications: Notification[] = response.data.map((message) => ({
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
  }))
  return notifications
}
