import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'

import NotificationBellBadge from '@holi/core/navigation/components/header/NotificationBellBadge'
import { notificationPollingInterval } from '@holi/core/screens/notifications/config'
import { useUnseenNotificationsCount } from '@holi/core/screens/notifications/hooks/useUnseenNotificationsCount'
import { HasNewNotificationsQuery, HasNewNotificationsResponse } from '@holi/core/screens/notifications/queries'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Notification2 } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

export const NotificationBellButton: React.FC<{
  onPress: () => void
  color: string | undefined
}> = (props) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()

  const { data } = useQuery<HasNewNotificationsResponse>(HasNewNotificationsQuery, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
    pollInterval: notificationPollingInterval,
  })

  const { hasUnseenNotifications: hasUnseenNovuNotifications } = useUnseenNotificationsCount()

  const hasNewNotifications = !!data?.hasNewNotifications?.status || hasUnseenNovuNotifications

  return (
    <NotificationBellBadge visible={hasNewNotifications}>
      <HoliButton
        label={t('notifications.title')}
        inline
        testID="btn-to-notifications"
        transparent
        onPress={props.onPress}
      >
        <HoliIcon icon={Notification2} color={props.color} />
      </HoliButton>
    </NotificationBellBadge>
  )
}
