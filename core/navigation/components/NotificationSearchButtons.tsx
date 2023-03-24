import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'

import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { logError } from '@holi/core/errors/helpers'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import NotificationBadge from '@holi/core/navigation/components/NotificationBadge'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { HasNewNotifcationsQuery, HasNewNotifcationsResponse } from '@holi/core/screens/notifications/queries'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'

const NOTIFICATION_POLLING_INTERVAL = process.env.NOTIFICATION_POLLING_INTERVAL
  ? parseInt(process.env.NOTIFICATION_POLLING_INTERVAL, 10)
  : 5000

const NotificationSearchButtons = ({ tintColor }: HeaderButtonProps) => {
  const { t } = useTranslation()
  const { navigate } = useUnifiedNavigation()
  const { isLoggedIn } = useAuth()

  const { error: hasNewNotificationsError, data } = useQuery<HasNewNotifcationsResponse>(HasNewNotifcationsQuery, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
    pollInterval: NOTIFICATION_POLLING_INTERVAL,
  })

  if (hasNewNotificationsError) {
    logError(hasNewNotificationsError, `[NotificationSearchButtons.tsx] ${hasNewNotificationsError.message}`)
  }

  const hasNewNotifications = !!data?.hasNewNotifications?.status

  // TODO: remove after implementing the feature
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

  return (
    <HoliHorizontalRow>
      {/* TODO start: remove after Alpha */}
      <HoliButton
        type="secondary"
        variant="small"
        label=""
        onPress={() => Linking.openURL('https://fjyj0x83dwu.typeform.com/to/Q0W2YncW')}
      >
        Feedback
      </HoliButton>
      {/* TODO end: remove after Alpha */}

      {!!isLoggedIn && (
        <NotificationBadge visible={hasNewNotifications}>
          <HoliButton
            label={t('notifications.title')}
            inline
            testID="btn-to-notifications"
            transparent
            onPress={() => {
              navigate('/notifications')
            }}
          >
            <HoliIcon icon="notification-2" size={24} color={tintColor} />
          </HoliButton>
        </NotificationBadge>
      )}

      <HoliButton
        label={t('navigation.search')}
        inline
        transparent
        onPress={() => {
          // TODO: remove after implementing the feature
          showFeatureNotImplementedToast()
          // navigate('/search')
        }}
      >
        <HoliIcon icon="search" size={24} color={tintColor} />
      </HoliButton>
    </HoliHorizontalRow>
  )
}

export default NotificationSearchButtons
