import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useEffect, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { string } from 'zod'

import ScrollBasedCallbackInvocation from '@holi/core/components/ScrollBasedCallbackInvocation'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { logError } from '@holi/core/errors/helpers'
import { isLastWeek, isThisWeek } from '@holi/core/helpers'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import i18n from '@holi/core/i18n'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { SHOWN_NOTIFICATIONS } from '@holi/core/screens/notifications/components/NotificationItem'
import {
  NotificationGroup,
  NotificationSectionList,
} from '@holi/core/screens/notifications/components/NotificationSectionList'
import { NotificationsNotLoggedInHint } from '@holi/core/screens/notifications/components/NotificationsNotLoggedInHint'
import { Notification } from '@holi/core/screens/notifications/components/types'
import { notificationPollingInterval } from '@holi/core/screens/notifications/config'
import { useNotifications } from '@holi/core/screens/notifications/hooks/useNotifications'
import {
  LastSeenNotificationMutation,
  NotificationsResponse,
  lastSeenNotificationResponse,
  notificationsQuery,
} from '@holi/core/screens/notifications/queries'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors, vars } from '@holi/ui/styles/globalVars'

const NotificationsOverview = () => {
  const { isLoggedIn } = useLoggedInUser()
  const { navigate } = useRouting()

  const {
    notifications: novuNotifications,
    isLoading: loadingNovuNotifications,
    markAllNotificationsAsSeen,
    canFetchMore,
    fetchNextPage,
    isFetchingMore,
    refresh,
  } = useNotifications()

  const [getNotifications, { data, error: notificationsQueryError, loading }] = useLazyQuery<NotificationsResponse>(
    notificationsQuery,
    {
      variables: { offset: 0, limit: 100 },
      fetchPolicy: 'network-only',
      pollInterval: notificationPollingInterval,
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

  useEffect(() => {
    if (novuNotifications.length > 0) {
      markAllNotificationsAsSeen()
    }
  }, [markAllNotificationsAsSeen, novuNotifications])

  const footer = useMemo(() => <View style={styles.footer} />, [])
  const loadMoreComponent = useMemo(
    () => <ScrollBasedCallbackInvocation callback={fetchNextPage} placeholder={footer} />,
    [fetchNextPage, footer]
  )

  const { refreshing, onRefresh } = useOnRefresh(refresh)

  if (loading || loadingNovuNotifications || notificationsQueryError)
    return <HoliLoader style={styles.loader} testID="loader" />

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

  const allNotifications = [...(data?.notifications?.data ?? []), ...novuNotifications]

  const groupedNotifications = groupByDate(allNotifications)

  return (
    <>
      {isFetchingMore ? <HoliLoader style={styles.loader} testID="fetch-more-loader" /> : null}
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{ refreshing, onRefresh }}
        webWrapperStyle={styles.webWrapperStyle}
        headerOverlap
        ScrollViewComponent={(props) => (
          <NotificationSectionList
            {...props}
            notifications={groupedNotifications}
            footer={canFetchMore ? loadMoreComponent : footer}
          />
        )}
      />
    </>
  )
}

const styles = StyleSheet.create({
  loader: {
    height: 300,
  },
  footer: {
    marginBottom: +vars.bottomBarHeight,
  },
  webWrapperStyle: {
    backgroundColor: colors.background30,
  },
})

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
    .sort(sortByCreatedNewestFirst)
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

function sortByCreatedNewestFirst(a: Notification, b: Notification) {
  return b.created.localeCompare(a.created)
}
