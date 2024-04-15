import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useUserConnection } from '@holi/core/helpers'
import NotificationWithUserAvatar from '@holi/core/screens/notifications/components/NotificationWithUserAvatar'
import {
  Notification,
  NotificationConnection,
  NotificationProps,
  NotificationType,
} from '@holi/core/screens/notifications/components/types'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

const isNotificationConnectionAccepted = ({ notificationType }: Notification) =>
  notificationType === NotificationType.CONNECTION_ACCEPTED ||
  notificationType === NotificationType.CONNECTION_CONFIRMED

const NotificationConnectionItem: React.FC<NotificationProps<NotificationConnection>> = ({
  notification,
  style,
  testID,
}) => {
  const { id: userId } = notification.options.user
  const { t } = useTranslation()
  // if 'connectionAccepted' is 'true', user accepted the connection
  // if 'connectionAccepted' is null, it's not accepted and the user did not interact. Is set to false, when the connection is ignored.
  const [connectionAccepted, setConnectionAccepted] = useState<boolean | null>(
    isNotificationConnectionAccepted(notification) || null
  )
  const { displayError } = useErrorHandling()

  const { connect, disconnect, error, loading } = useUserConnection()

  useEffect(() => {
    if (error) {
      displayError(error, 'Failed to update user connection', {
        location: 'NotificationConnectionItem.useEffect',
        notificationType: notification.notificationType,
      })
    }
  }, [displayError, error, notification.notificationType])

  const getI18Key = () => {
    // this message is for 'CONNECTION_REQUEST' notification before user does any action
    if (connectionAccepted === null) {
      return 'notifications.connection.message'
    } else if (connectionAccepted === true) {
      switch (notification.notificationType) {
        // 'CONNECTION_CONFIRMED' will be shown to a request sender user
        case NotificationType.CONNECTION_CONFIRMED:
          return 'notifications.connection.confirmation.message'

        // 'CONNECTION_ACCEPTED' will be shown to an accepter user
        case NotificationType.CONNECTION_ACCEPTED:
        default:
          // default case is for 'CONNECTION_REQUEST' notification after user accepted connection
          return 'notifications.connection.accepted.message'
      }
    } else {
      // this message is for 'CONNECTION_REQUEST' notification after user ignored connection
      return 'notifications.connection.ignored.message'
    }
  }

  const buttons = [
    <HoliButton
      key="decline"
      type="secondary"
      variant="small"
      label={t('notifications.connection.ignore')}
      onPress={() => disconnect(userId).then(() => setConnectionAccepted(false))}
      disabled={loading}
      style={styles.button}
      testID="ignore-connection-request-button"
    >
      {t('notifications.connection.ignore')}
    </HoliButton>,
    <HoliButton
      key="accept"
      type="primary"
      variant="small"
      label={t('notifications.connection.accept')}
      onPress={() => connect(userId).then(() => setConnectionAccepted(true))}
      disabled={loading}
      style={styles.button}
      testID="accept-connection-request-button"
    >
      {t('notifications.connection.accept')}
    </HoliButton>,
  ]

  return (
    <View testID={testID}>
      <NotificationWithUserAvatar
        notification={notification}
        i18nKey={getI18Key()}
        style={[style, loading && styles.notificationProcessing]}
        testID={`${testID ? testID + '-' : ''}notification-item`}
      >
        {connectionAccepted === null && (
          <HoliHorizontalRow gap={8} style={styles.buttonContainer}>
            {buttons}
          </HoliHorizontalRow>
        )}
      </NotificationWithUserAvatar>

      {loading && <HoliLoader testID="connection-notification-loader-indicator" />}
    </View>
  )
}

const styles = StyleSheet.create({
  notificationProcessing: {
    opacity: 0.5,
  },
  buttonContainer: {
    paddingLeft: 48,
  },
  button: {
    marginTop: 12,
  },
})

export default NotificationConnectionItem
