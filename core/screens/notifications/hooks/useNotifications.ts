import { HeadlessService } from '@novu/headless'
import { useCallback, useEffect, useRef, useState } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { Notification, NotificationType } from '@holi/core/screens/notifications/components/types'
import { novuApplicationIdentifier } from '@holi/core/screens/notifications/config'
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
          console.log('fetchNotifications listener', JSON.stringify(result, null, 2))
          // Handle the state of the fetching process and errors here.
          setIsFetching(result.isFetching)
        },
        onSuccess: (response) => {
          console.log('fetchNotifications onSuccess', JSON.stringify(response, null, 2))

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
      subscriberId: subscriberId,
    })

    headlessServiceRef.current = headlessService

    return headlessService.initializeSession({
      listener: (result) => {
        console.log('initializeSession listener', JSON.stringify(result, null, 2))
      },
      onSuccess: (session) => {
        console.log('initializeSession onSuccess', JSON.stringify(session, null, 2))
        headlessServiceRef.current = headlessService

        fetchNotifications()
      },
      onError: (error) =>
        logError(error, 'Error initializing notifications session', {
          location: 'useNotifications.initializeSession',
        }),
    })
  }, [fetchNotifications, subscriberId])

  const markAllNotificationsAsRead = (feedId: string) => {
    const headlessService = headlessServiceRef.current

    if (headlessService) {
      headlessService.markAllMessagesAsRead({
        listener: (result) => {
          console.log('markNotificationsAsRead listener', JSON.stringify(result, null, 2))
          // Handle the result of marking all messages as read
        },
        onError: (error) =>
          logError(error, 'Error marking all notifications as read', {
            location: 'useNotifications.markAllMessagesAsRead',
          }),
        feedId: feedId, // Pass the feed ID here, it can be an array or a single ID
      })
    }
  }

  return { notifications, markAllNotificationsAsRead, isFetching }
}
