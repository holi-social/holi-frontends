import { ApiService } from '@novu/client'
import { IMessage, IPaginatedResponse } from '@novu/shared'
import { useCallback, useEffect, useRef, useState } from 'react'

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

  const novuServiceRef = useRef<ApiService | null>(null)
  const fetchIntervalIdRef = useRef<number | null>(null)

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

  const fetchMessages = useCallback(() => {
    const novu = novuServiceRef.current
    if (novu) {
      novu.getNotificationsList(NOVU_NOTIFICATIONS_PAGE_TO_FETCH).then(processMessagesResponse)
    }
  }, [processMessagesResponse])

  const fetchMessagesContinually = useCallback(() => {
    // @ts-ignore
    // return type inference for setInterval is wrong in Pycharm Pro
    fetchIntervalIdRef.current = setInterval(() => {
      fetchMessages()
    }, refetchInterval)
  }, [fetchMessages, refetchInterval])

  const markAllNotificationsAsRead = useCallback(() => {
    const novu = novuServiceRef.current
    if (novu) {
      //all feeds
      const feedId = undefined
      novu.markAllMessagesAsRead(feedId)
    }
  }, [])

  useEffect(() => {
    if (subscriberId) {
      const novuService = new ApiService(novuBackendUrl)
      novuService.initializeSession(novuApplicationIdentifier, subscriberId).then((session) => {
        novuService.setAuthorizationToken(session.token)
        novuServiceRef.current = novuService

        fetchMessages()
        fetchMessagesContinually()
      })

      return () => {
        if (fetchIntervalIdRef.current) {
          clearInterval(fetchIntervalIdRef.current)
        }
      }
    }

    return () => ({})
  }, [fetchMessages, subscriberId, fetchMessagesContinually, markAllNotificationsAsRead])

  return { notifications, markAllNotificationsAsRead }
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
