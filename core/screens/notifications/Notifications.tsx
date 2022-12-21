import { useLazyQuery } from '@apollo/client'
import React, { memo, useEffect, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, SectionList, StyleSheet, View } from 'react-native'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { isLastWeek, isThisWeek, useScrollYHandler } from '@holi/core/helpers'
import i18n from '@holi/core/i18n'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import NotificationItem from '@holi/core/screens/notifications/components/NotificationItem'
import { Notification } from '@holi/core/screens/notifications/components/types'
import { NotificationsResponse, notificationsQuery } from '@holi/core/screens/notifications/queries'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface NotificationGroup {
  title: string
  data: Notification[]
}

const sortNotificationsByDate = (notifications: Notification[]) => {
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

const Notifications: React.VFC = () => {
  const { t } = useTranslation()
  const title = t('notifications.title')
  const mixins = useStyleMixins()
  const { setOptions } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()
  const { isLoggedIn } = useAuth()

  const [getNotifications, { data, error, loading }] = useLazyQuery<NotificationsResponse>(notificationsQuery, {
    variables: { offset: 0, limit: 100 },
    fetchPolicy: 'network-only',
    pollInterval: 10000,
  })

  // Fetch notifications only if user is logged in
  useEffect(() => {
    isLoggedIn && getNotifications()
  }, [getNotifications, isLoggedIn])

  useLayoutEffect(
    () =>
      setOptions({
        title,
        headerStyle: { backgroundColor: colors.backgroundColorGreyLight },
        headerTransparent: true,
        headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon="arrow-down-s" />),
        headerRight: ({ tintColor }) =>
          Platform.OS === 'web' ? <HeaderBackButton icon="close" tintColor={tintColor} /> : undefined,
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setOptions, title]
  )

  if (loading || error || !data) return <View style={styles.mainWrapper} />

  const sortedNotificationsByDate = sortNotificationsByDate(data.notifications.data)

  return (
    <>
      <SafeAreaView />

      <View style={styles.mainWrapper}>
        <SectionList
          sections={sortedNotificationsByDate}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => <NotificationItem notification={item} style={styles.notification} />}
          renderSectionHeader={({ section }) => (
            <HoliHeading
              size="small"
              // add margin top for first section header to have space before HeaderAnimated
              style={[styles.groupTitle, section === sortedNotificationsByDate[0] && styles.firstGroupTitle]}
            >
              {section.title}
            </HoliHeading>
          )}
          // render section footer for last section to have margin bellow
          renderSectionFooter={({ section }) =>
            section === sortedNotificationsByDate[sortedNotificationsByDate.length - 1] ? (
              <View style={styles.lastSectionFooter} />
            ) : null
          }
          onScroll={onScreenScroll}
          scrollEventThrottle={200}
          stickySectionHeadersEnabled={false}
          style={mixins.container}
        />
      </View>
    </>
  )
}

export default memo(Notifications)

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: colors.backgroundColorGreyLight,
    ...Platform.select({
      web: {
        height: '100vh',
      },
    }),
  },
  groupTitle: {
    paddingVertical: 12,
  },
  firstGroupTitle: {
    marginTop: vars.topBarHeight,
  },
  lastSectionFooter: {
    marginBottom: vars.bottomBarHeight,
  },
  notification: {
    paddingVertical: 12,
  },
})
