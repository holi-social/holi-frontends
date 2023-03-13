import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionList, StyleSheet, View } from 'react-native'
import { string } from 'zod'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { logError } from '@holi/core/errors/helpers'
import { isLastWeek, isThisWeek, onScreenScrollY } from '@holi/core/helpers'
import i18n from '@holi/core/i18n'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import NotificationItem, { SHOWN_NOTIFICATIONS } from '@holi/core/screens/notifications/components/NotificationItem'
import { Notification } from '@holi/core/screens/notifications/components/types'
import { NotificationsResponse, notificationsQuery } from '@holi/core/screens/notifications/queries'
import { LastSeenNotificationMutation, lastSeenNotificationResponse } from '@holi/core/screens/notifications/queries'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { vars } from '@holi/ui/styles/globalVars'

interface NotificationGroup {
  title: string
  data: Notification[]
}

const containsNotifications = (notifications?: Notification[]) => {
  if (!notifications) return false
  return notifications.some((notification) => {
    return SHOWN_NOTIFICATIONS.includes(notification.notificationType)
  })
}

const groupByDate = (notifications?: Notification[]) => {
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

const NotificationsOverview: React.VFC = () => {
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()
  const { navigate } = useRouting()

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
      logError(mutationError, `[NotificationsOverview.tsx] ${mutationError.message}`)
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

  if (loading || notificationsQueryError) return <HoliText>{t('global.loading')}</HoliText>

  if (!isLoggedIn) {
    return (
      <HoliNoResults
        firstText={t('loginRedirect.title')}
        media={
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/illustrations/illustration_settings.svg')}
            width={152}
            height={152}
            label=""
            isSvg
          />
        }
        secondText={t('loginRedirect.text')}
        style={[styles.noResultsMessage]}
      >
        <HoliButton label={t('loginRedirect.btnConfirm')} onPress={() => navigate('/login')}>
          {t('loginRedirect.btnConfirm')}
        </HoliButton>
      </HoliNoResults>
    )
  }

  if (!containsNotifications(data?.notifications?.data))
    return (
      <HoliNoResults
        firstText={t('notifications.display.empty.text1')}
        media={
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/illustrations/illustration_settings.svg')}
            width={152}
            height={152}
            label=""
            isSvg
          />
        }
        secondText={t('notifications.display.empty.text2')}
        style={[styles.noResultsMessage]}
      />
    )

  const groupedNotifications = groupByDate(data?.notifications?.data)

  return (
    <SectionList
      sections={groupedNotifications}
      keyExtractor={({ id }) => id}
      renderItem={({ item }) => <NotificationItem notification={item} style={styles.notification} />}
      renderSectionHeader={({ section }) => (
        <HoliHeading size="small" style={styles.groupTitle}>
          {section.title}
        </HoliHeading>
      )}
      renderSectionFooter={({ section }) =>
        section === groupedNotifications[groupedNotifications.length - 1] ? (
          <View style={styles.lastSectionFooter} />
        ) : null
      }
      onScroll={onScreenScrollY}
      scrollEventThrottle={200}
      stickySectionHeadersEnabled={false}
      style={styles.sectionList}
      testID="notification-list"
    />
  )
}

export default NotificationsOverview

const styles = StyleSheet.create({
  sectionList: {
    overflow: 'visible',
  },
  groupTitle: {
    paddingVertical: 12,
  },
  lastSectionFooter: {
    marginBottom: vars.bottomBarHeight,
  },
  notification: {
    paddingVertical: 12,
  },
  noResultsMessage: {
    marginTop: 24,
  },
})
