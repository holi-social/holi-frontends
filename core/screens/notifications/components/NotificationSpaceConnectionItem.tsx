import { useMutation } from '@apollo/client'
import type React from 'react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useErrorHandling } from '@holi/core/errors/hooks'
import NotificationSpaceItem from '@holi/core/screens/notifications/components/NotificationSpaceItem'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import {
  type Notification,
  type NotificationProps,
  type NotificationSpaceConnection,
  NotificationType,
} from '@holi/core/screens/notifications/components/types'
import {
  type UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { Button } from 'holi-bricks/components/button'
import { Spacing } from 'holi-bricks/tokens'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'

const isNotificationConnectionAccepted = ({ notificationType }: Notification) =>
  notificationType === NotificationType.COMMUNITY_MEMBERSHIP_APPROVED

const isNotificationConnectionRevoked = ({ notificationType }: Notification) =>
  notificationType === NotificationType.COMMUNITY_MEMBERSHIP_REVOKED

const notificationHasInteraction = ({ notificationType }: Notification) =>
  [NotificationType.COMMUNITY_MEMBERSHIP_REQUEST, NovuNotificationType.SPACE_MEMBERSHIP_REQUEST].includes(
    notificationType
  )

const NotificationSpaceConnectionItem: React.FC<NotificationProps<NotificationSpaceConnection>> = ({
  notification,
  style,
  testID,
}) => {
  const { t } = useTranslation()
  const { track } = useTracking()
  const { displayError } = useErrorHandling()

  // if 'connectionAccepted' is 'true', user accepted the connection
  // if 'connectionAccepted' is null, it's not accepted and the user did not interact. Is set to false, when the connection is declined.
  const [connectionAccepted, setConnectionAccepted] = useState<boolean | null>(
    isNotificationConnectionAccepted(notification) || null
  )

  const connectionRevoked = isNotificationConnectionRevoked(notification)

  const spaceId = notification.options.space.id

  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      variables: {
        spaceId,
        userId: notification.options.user.id,
      },
      onError(error) {
        const context = {
          location: 'NotificationSpaceConnectionItem.updateSpaceUserConnection',
          notificationType: notification.notificationType,
          spaceId,
        }
        if (error.message.includes('User did not request membership')) {
          displayError(error, 'Failed to update space user connection as membership was not requested', {
            displayMessage: t('spaces.membership.update.not-requested'),
            ...context,
          })
        } else {
          displayError(error, 'Failed to update space user connection', {
            displayMessage: t('spaces.membership.update.error'),
            ...context,
          })
        }
      },
    }
  )

  const approveConnectionRequest = useCallback(() => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBER,
      },
    }).then(() => {
      setConnectionAccepted(true)
      track(TrackingEvent.Spaces.RequestToJoin.accepted(spaceId))
    })
  }, [spaceId, track, updateSpaceUserConnection])

  const declineConnectionRequest = useCallback(() => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.DISCONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_REQUESTOR,
      },
    }).then(() => {
      setConnectionAccepted(false)
      track(TrackingEvent.Spaces.RequestToJoin.rejected(spaceId))
    })
  }, [spaceId, track, updateSpaceUserConnection])

  const loginState = useLoggedInUser()

  const showButtons = connectionAccepted === null && notificationHasInteraction(notification)

  const getI18nKey = () => {
    // Use content from notification if no interaction is possible or has not taken place yet
    if (notification.content && (!notificationHasInteraction(notification) || showButtons)) {
      return
    }
    // this message is for 'CONNECTION_REVOKED' notification
    if (connectionRevoked) return 'notifications.space.connection.revoked.message'

    // this message is for 'CONNECTION_REQUEST' notification before user does any action
    if (connectionAccepted === null)
      return loginState.isLoggedIn && loginState.user.id === notification.options.user.id
        ? 'notifications.space.connection.message'
        : 'notifications.space.connection.requested.message'

    if (connectionAccepted) {
      // this case is for 'CONNECTION_REQUEST_APPROVED' notification after connection was accepted
      return loginState.isLoggedIn && loginState.user.id === notification.options.user.id
        ? 'notifications.space.connection.accepted.message'
        : 'notifications.space.connection.joined.message'
    } else {
      // this message is for 'CONNECTION_REQUEST' notification after user declined connection
      return 'notifications.space.connection.declined.message'
    }
  }

  const buttons = [
    <Button
      inline
      key="decline"
      variant="secondary"
      size="sm"
      label={t('notifications.space.connection.decline')}
      onPress={declineConnectionRequest}
      disabled={loading}
      testID="decline-connection-request-button"
    />,
    <Button
      inline
      key="accept"
      variant="primary"
      size="sm"
      label={t('notifications.space.connection.accept')}
      onPress={approveConnectionRequest}
      disabled={loading}
      testID="accept-connection-request-button"
    />,
  ]

  if (!loginState.isLoggedIn) return <HoliLoader />

  return (
    <View testID={testID}>
      <NotificationSpaceItem
        notification={notification}
        i18nKey={getI18nKey()}
        style={[style, loading && styles.notificationProcessing]}
        testID={`${testID ? testID + '-' : ''}notification-item_${loginState.user.id}_${notification.options.user.id}`}
      >
        {showButtons && (
          <HoliHorizontalRow gap={8} style={styles.buttonContainer}>
            {buttons}
          </HoliHorizontalRow>
        )}
      </NotificationSpaceItem>

      {loading && <HoliLoader testID="connection-notification-loader-indicator" />}
    </View>
  )
}

const styles = StyleSheet.create({
  notificationProcessing: {
    opacity: 0.5,
  },
  buttonContainer: {
    paddingLeft: Spacing.xxl,
    marginTop: Spacing.xxs,
  },
})

export default NotificationSpaceConnectionItem
