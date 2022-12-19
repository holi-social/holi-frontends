import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import { displayError } from '@holi/core/errors/helpers'
import { useUserConnection } from '@holi/core/helpers'
import NotificationBaseItem from '@holi/core/screens/notifications/components/NotificationBaseItem'
import {
  Notification,
  NotificationConnection,
  NotificationProps,
  NotificationType,
} from '@holi/core/screens/notifications/components/types'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { vars } from '@holi/ui/styles/globalVars'

const isNotificationConnectionAccepted = ({ notificationType }: Notification) =>
  notificationType === NotificationType.CONNECTION_ACCEPTED ||
  notificationType === NotificationType.CONNECTION_CONFIRMED

const NotificationConnectionItem: React.VFC<NotificationProps<NotificationConnection>> = ({ notification, style }) => {
  const { id: userId } = notification.options.user
  const { t } = useTranslation()
  const { width: screenWidth } = useWindowDimensions()
  // if 'connectionAccepted' is 'true' user accepted connection, else user ignored connection
  const [connectionAccepted, setConnectionAccepted] = useState<boolean | null>(
    isNotificationConnectionAccepted(notification) || null
  )
  // if 'connectionHandeled' is 'true', user already has accepted or ignored connection
  const [connectionHandeled, setConnectionHandeled] = useState(isNotificationConnectionAccepted(notification))

  const { connect, disconnect, error, loading } = useUserConnection()

  if (error) {
    displayError(error, t('user.profileView.connection.error'))
  }

  const getI18Key = () => {
    // this message is for 'CONNECTION_REQUEST' notification before user does any action
    if (!connectionHandeled) return 'notifications.connection.message'
    if (connectionAccepted) {
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
      label={t('notifications.connection.ignore')}
      onPress={() =>
        disconnect(userId).then(() => {
          setConnectionAccepted(false)
          setConnectionHandeled(true)
        })
      }
      disabled={loading}
      style={styles.button}
    >
      {t('notifications.connection.ignore')}
    </HoliButton>,
    <HoliButton
      key="accept"
      type="primary"
      label={t('notifications.connection.accept')}
      onPress={() =>
        connect(userId).then(() => {
          setConnectionAccepted(true)
          setConnectionHandeled(true)
        })
      }
      disabled={loading}
      style={styles.button}
    >
      {t('notifications.connection.accept')}
    </HoliButton>,
  ]

  return (
    <View>
      <NotificationBaseItem
        notification={notification}
        i18nKey={getI18Key()}
        style={[style, loading && styles.notificationProcessing]}
      >
        {!connectionHandeled &&
          (screenWidth > +vars.breakpointXs ? (
            <HoliHorizontalRow gap={8} style={styles.buttonContainer}>
              {buttons}
            </HoliHorizontalRow>
          ) : (
            <View style={styles.buttonContainer}>{buttons}</View>
          ))}
      </NotificationBaseItem>

      {loading && (
        <Animated.View style={styles.loaderContainer} entering={FadeIn} exiting={FadeOut.delay(300)}>
          <View style={styles.loader}>
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

export default NotificationConnectionItem
