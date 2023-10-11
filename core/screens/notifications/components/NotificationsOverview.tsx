import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useEffect } from 'react'
import { string } from 'zod'

import { logError } from '@holi/core/errors/helpers'
import { isLastWeek, isThisWeek } from '@holi/core/helpers'
import i18n from '@holi/core/i18n'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { SHOWN_NOTIFICATIONS } from '@holi/core/screens/notifications/components/NotificationItem'
import {
  NotificationGroup,
  NotificationSectionList,
} from '@holi/core/screens/notifications/components/NotificationSectionList'
import { NotificationsEmptyPlaceholder } from '@holi/core/screens/notifications/components/NotificationsEmptyPlaceholder'
import { NotificationsNotLoggedInHint } from '@holi/core/screens/notifications/components/NotificationsNotLoggedInHint'
import { Notification } from '@holi/core/screens/notifications/components/types'
import {
  LastSeenNotificationMutation,
  NotificationsResponse,
  lastSeenNotificationResponse,
  notificationsQuery,
} from '@holi/core/screens/notifications/queries'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

const NotificationsOverview = () => {
  const { isLoggedIn } = useLoggedInUser()
  const { navigate } = useRouting()

  // Skip using Novu in-app notifications for now
  // useNotification is using the HeadlessService from @novu/headless,
  // and it doesn't work on react-native as it uses localStorage
  // https://github.com/novuhq/novu/blob/4e462d06c5ce9b1eb4e3d38e64dcf904b53f8cdb/packages/headless/src/lib/headless.service.ts#L50
  // const { notifications } = useNotifications(user?.id)
  const notifications: Notification[] = []

  const [getNotifications, { data, error: notificationsQueryError, loading }] = useLazyQuery<NotificationsResponse>(
    notificationsQuery,
    {
      variables: { offset: 0, limit: 100 },
      fetchPolicy: 'network-only',
      pollInterval: 10000,
    }
  )

  const [reportLastSeenNotification] = useMutation<lastSeenNotificationResponse>(LastSeenNotificationMutation, {
    variables: { notificationId: string },
    onError: (mutationError) => {
      logError(mutationError, 'Failed to report last seen notification', {
        location: 'NotificationsOverview.LastSeenNotificationMutation',
      })
    },
  })

  // Fetch notifications only if user is logged in
  useEffect(() => {
    isLoggedIn && getNotifications()
  }, [getNotifications, isLoggedIn])

  useEffect(() => {
    if (containsNotifications(data?.notifications?.data)) {
      const lastNotification = data?.notifications?.data[0]
      reportLastSeenNotification({ variables: { notificationId: lastNotification?.id } })
    }
  }, [data, reportLastSeenNotification])

  if (loading || notificationsQueryError) return <HoliLoader style={{ height: 300 }} testID="loader" />

  if (!isLoggedIn) {
    return (
      <NotificationsNotLoggedInHint
        onPress={() => {
          setPathToRedirect('/notifications')
          navigate('/login')
        }}
      />
    )
  }

  if (!containsNotifications(data?.notifications?.data)) return <NotificationsEmptyPlaceholder />

  const allNotifications = [...(data?.notifications?.data ?? []), ...notifications]

  const groupedNotifications = groupByDate(allNotifications)

  return <NotificationSectionList notifications={groupedNotifications} />
}

export default NotificationsOverview

function containsNotifications(notifications?: Notification[]) {
  if (!notifications) return false
  return notifications.some((notification) => {
    return SHOWN_NOTIFICATIONS.includes(notification.notificationType)
  })
}

function groupByDate(notifications?: Notification[]) {
  if (!notifications) return []
  return notifications
    .reduce(
      (acc, notification) => {
        const { created } = notification
        if (isThisWeek(notification.created)) {
          acc[0].data.push(notification)
        } else if (isLastWeek(created)) {
          acc[1].data.push(notification)
        } else {
          acc[2].data.push(notification)
        }

        return acc
      },
      [
        {
          title: i18n.t('notifications.created.thisWeek'),
          data: [],
        },
        {
          title: i18n.t('notifications.created.lastWeek'),
          data: [],
        },
        {
          title: i18n.t('notifications.created.older'),
          data: [],
        },
      ] as [NotificationGroup, NotificationGroup, NotificationGroup]
    )
    .filter(({ data }) => data.length)
}
