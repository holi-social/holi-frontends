import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { useErrorHandling } from '@holi/core/errors/hooks'
import NotificationWithSpaceAvatar from '@holi/core/screens/notifications/components/NotificationWithSpaceAvatar'
import {
  Notification,
  NotificationProps,
  NotificationSpaceConnection,
  NotificationType,
} from '@holi/core/screens/notifications/components/types'
import { UpdateSpaceUserConnectionResponse, updateSpaceUserConnectionMutation } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

const isNotificationConnectionAccepted = ({ notificationType }: Notification) =>
  notificationType === NotificationType.COMMUNITY_MEMBERSHIP_APPROVED

const NotificationSpaceConnectionItem: React.VFC<NotificationProps<NotificationSpaceConnection>> = ({
  notification,
  style,
  testID,
}) => {
  const { t } = useTranslation()
  // if 'connectionAccepted' is 'true', user accepted the connection
  // if 'connectionAccepted' is null, it's not accepted and the user did not interact. Is set to false, when the connection is ignored.
  const [connectionAccepted, setConnectionAccepted] = useState<boolean | null>(
    isNotificationConnectionAccepted(notification) || null
  )
  const { displayError } = useErrorHandling()

  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      variables: {
        spaceId: notification.options.space.id,
        userId: notification.options.user.id,
      },
      onError(error) {
        if (error.message.includes('User did not request membership')) {
          displayError(error, t('spaces.membership.update.not-requested'))
        } else {
          displayError(error, t('spaces.membership.update.error'))
        }
      },
    }
  )

  const approveConnectionRequest = () => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBER,
      },
    }).then(() => setConnectionAccepted(true))
  }

  const rejectConnectionRequest = () => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.DISCONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_REQUESTOR,
      },
    }).then(() => setConnectionAccepted(false))
  }

  const { userId } = useAuth()

  const getI18Key = () => {
    // this message is for 'CONNECTION_REQUEST' notification before user does any action
    if (connectionAccepted === null)
      return userId === notification.options.user.id
        ? 'notifications.space.connection.message'
        : 'notifications.space.connection.requested.message'

    if (connectionAccepted === true) {
      // this case is for 'CONNECTION_REQUEST_APPROVED' notification after connection was accepted
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
      onPress={rejectConnectionRequest}
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
      onPress={approveConnectionRequest}
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
        {connectionAccepted === null && (
          <HoliHorizontalRow gap={8} style={styles.buttonContainer}>
            {buttons}
          </HoliHorizontalRow>
        )}
      </NotificationWithSpaceAvatar>

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

export default NotificationSpaceConnectionItem
