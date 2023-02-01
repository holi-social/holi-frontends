import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { displayError } from '@holi/core/errors/helpers'
import { useUserConnection } from '@holi/core/helpers'
import NotificationWithSpaceAvatar from '@holi/core/screens/notifications/components/NotificationWithSpaceAvatar'
import {
  Notification,
  NotificationProps,
  NotificationSpaceConnection,
  NotificationType,
} from '@holi/core/screens/notifications/components/types'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'

const isNotificationConnectionAccepted = ({ notificationType }: Notification) =>
  notificationType === NotificationType.COMMUNITY_MEMBERSHIP_APPROVED

const NotificationSpaceConnectionItem: React.VFC<NotificationProps<NotificationSpaceConnection>> = ({
  notification,
  style,
  testID,
}) => {
  const { id: spaceUserId } = notification.options.user
  const { t } = useTranslation()
  // if 'connectionAccepted' is 'true' user accepted connection, else user ignored connection
  const [connectionAccepted, setConnectionAccepted] = useState<boolean | null>(
    isNotificationConnectionAccepted(notification) || null
  )
  // if 'connectionHandeled' is 'true', user already has accepted or ignored connection
  const [connectionHandeled, setConnectionHandeled] = useState(isNotificationConnectionAccepted(notification))

  const { connect, disconnect, error, loading } = useUserConnection()

  if (error) {
    displayError(error, t('global.technicalError'))
  }

  const { userId } = useAuth()

  const getI18Key = () => {
    // this message is for 'CONNECTION_REQUEST' notification before user does any action
    if (!connectionHandeled)
      return userId === notification.options.user.id
        ? 'notifications.space.connection.message'
        : 'notifications.space.connection.requested.message'

    if (connectionAccepted) {
      // default case is for 'CONNECTION_REQUEST_APPROVED' notification after connection was accepted
      return userId === notification.options.user.id
        ? 'notifications.space.connection.accepted.message'
        : 'notifications.space.connection.joined.message'
    } else {
      // this message is for 'CONNECTION_REQUEST' notification after user ignored connection
      return 'notifications.space.connection.ignored.message'
    }
  }

  const buttons = [
    <HoliButton
      key="decline"
      type="secondary"
      variant="small"
      label={t('notifications.connection.ignore')}
      onPress={() =>
        disconnect(spaceUserId).then(() => {
          setConnectionAccepted(false)
          setConnectionHandeled(true)
        })
      }
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
      onPress={() =>
        connect(spaceUserId).then(() => {
          setConnectionAccepted(true)
          setConnectionHandeled(true)
        })
      }
      disabled={loading}
      style={styles.button}
      testID="accept-connection-request-button"
    >
      {t('notifications.connection.accept')}
    </HoliButton>,
  ]

  return (
    <View testID={testID}>
      <NotificationWithSpaceAvatar
        notification={notification}
        i18nKey={getI18Key()}
        style={[style, loading && styles.notificationProcessing]}
        testID={`${testID ? testID + '-' : ''}notification-item_${userId}_${notification.options.user.id}`}
      >
        {!connectionHandeled && (
          <HoliHorizontalRow gap={8} style={styles.buttonContainer}>
            {buttons}
          </HoliHorizontalRow>
        )}
      </NotificationWithSpaceAvatar>

      {loading && (
        <Animated.View style={styles.loaderContainer} entering={FadeIn} exiting={FadeOut.delay(300)}>
          <View style={styles.loader} testID="connection-notification-loader-indicator">
            <HoliLottie animType="loader" />
          </View>
        </Animated.View>
      )}
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
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  loader: {
    height: 64,
    width: 64,
  },
})

export default NotificationSpaceConnectionItem
