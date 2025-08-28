import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useEffect, useMemo } from 'react'
import { Platform, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { string } from 'zod'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import ScrollBasedCallbackInvocation from '@holi/core/components/ScrollBasedCallbackInvocation'
import { logError } from '@holi/core/errors/helpers'
import { isLastWeek, isThisWeek } from '@holi/core/helpers'
import i18n from '@holi/core/i18n'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { SHOWN_NOTIFICATIONS } from '@holi/core/screens/notifications/components/NotificationItem'
import RefreshableNotificationSectionList, {
  type NotificationGroup,
} from '@holi/core/screens/notifications/components/NotificationSectionList'
import { NotificationsNotLoggedInHint } from '@holi/core/screens/notifications/components/NotificationsNotLoggedInHint'
import type { Notification } from '@holi/core/screens/notifications/components/types'
import { notificationPollingInterval } from '@holi/core/screens/notifications/config'
import { useNotifications } from '@holi/core/screens/notifications/hooks/useNotifications'
import {
  LastSeenNotificationMutation,
  type NotificationsResponse,
  type lastSeenNotificationResponse,
  notificationsQuery,
} from '@holi/core/screens/notifications/queries'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

const NotificationsOverview = () => {
  const { isLoggedIn } = useLoggedInUser()
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const {
    notifications: novuNotifications,
    isLoading: loadingNovuNotifications,
    markAllNotificationsAsSeen,
    canFetchMore,
    fetchNextPage,
    isFetchingMore,
    refetch,
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
    if (isLoggedIn) {
      getNotifications()
    }
  }, [getNotifications, isLoggedIn])

  useEffect(() => {
    if (containsNotifications(data?.notifications?.data as Notification[])) {
      const lastNotification = data?.notifications?.data[0]
      reportLastSeenNotification({ variables: { notificationId: lastNotification?.id } })
    }
  }, [data, reportLastSeenNotification])

  useEffect(() => {
    if (novuNotifications.length > 0) {
      markAllNotificationsAsSeen()
    }
  }, [markAllNotificationsAsSeen, novuNotifications])

  useOnRefresh(refetch)
  useOnRefresh(getNotifications)

  const topLoader = <HoliLoader style={styles.loader} testID="loader" />
  const loadMoreComponent = useMemo(() => {
    const footer = <View style={styles.footer} />
    if (canFetchMore) {
      return (
        <ScrollBasedCallbackInvocation
          callback={fetchNextPage}
          placeholder={
            Platform.OS === 'android' ? footer : <HoliLoader style={styles.bottomLoader} testID="fetch-more-loader" />
          }
        />
      )
    }
    return footer
  }, [canFetchMore, fetchNextPage, styles.bottomLoader, styles.footer])

  const allNotifications = useMemo(
    () => [...(data?.notifications?.data ?? []), ...novuNotifications],
    [data?.notifications?.data, novuNotifications]
  )

  const groupedNotifications = useMemo(() => groupByDate(allNotifications), [allNotifications])

  if (loading || loadingNovuNotifications || notificationsQueryError) return topLoader

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

  return (
    <>
      {Platform.OS === 'android' && isFetchingMore ? topLoader : null}
      <RefreshableNotificationSectionList
        webWrapperStyle={styles.webWrapperStyle}
        headerOverlap={false}
        notifications={groupedNotifications}
        footer={loadMoreComponent}
        style={styles.scrollView}
      />
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    loader: {
      flex: 1,
    },
    bottomLoader: {
      position: 'relative',
      marginBottom: dimensions.bottomBarHeight,
    },
    scrollView: {
      ...Platform.select({
        web: {
          marginHorizontal: 'auto',
          minHeight: '100%',
        },
      }),
    },
    footer: {
      marginBottom: dimensions.bottomBarHeight,
    },
    webWrapperStyle: {
      backgroundColor: theme.colors.background30,
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
  return [...notifications]
    .filter(({ notificationType }) => SHOWN_NOTIFICATIONS.includes(notificationType))
    .sort(compareByCreatedNewestFirst)
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

function compareByCreatedNewestFirst(a: Notification, b: Notification) {
  return b.created.localeCompare(a.created)
}
