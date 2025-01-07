import { useMutation } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useErrorHandling } from '@holi/core/errors/hooks'
import NotificationSpaceItem from '@holi/core/screens/notifications/components/NotificationSpaceItem'
import {
  NotificationProps,
  NotificationSpaceConnection,
  NotificationType,
} from '@holi/core/screens/notifications/components/types'
import {
  UpdateSpaceUserConnectionResponse,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { discoverSpacesQuery, mySpaceQuery } from '@holi/core/screens/spaces/discover/queries'
import { SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

const isNotificationInvitationDeclined = ({ notificationType }: NotificationSpaceConnection) =>
  notificationType === NotificationType.COMMUNITY_INVITE_DECLINED

const NotificationSpaceInviteItem: React.FC<NotificationProps<NotificationSpaceConnection>> = ({
  notification,
  style,
  testID,
}) => {
  const isInvitationDeclinedNotification = isNotificationInvitationDeclined(notification)
  const [inviteAccepted, setInviteAccepted] = useState<boolean>(false)
  const [inviteDeclined, setInviteDeclined] = useState<boolean>(isInvitationDeclinedNotification)
  const { t } = useTranslation()

  const { displayError } = useErrorHandling()

  const loginState = useLoggedInUser()

  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      variables: {
        spaceId: notification.options.space.id,
      },
      onError(error) {
        const context = {
          location: 'NotificationSpaceInviteItem.updateSpaceUserConnection',
          notificationType: notification.notificationType,
          spaceId: notification.options.space.id,
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
      refetchQueries: [{ query: discoverSpacesQuery }, { query: mySpaceQuery }],
    }
  )

  const acceptInvite = useCallback(() => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
      },
    }).then(() => setInviteAccepted(true))
  }, [updateSpaceUserConnection])

  const declineInvite = useCallback(() => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.DISCONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
      },
    }).then(() => setInviteDeclined(true))
  }, [updateSpaceUserConnection])

  const showButtons = !inviteDeclined && !inviteAccepted

  const getI18Key = () => {
    // Use content from notification if no interaction has taken place yet
    if (notification.content && showButtons) {
      return
    }
    if (inviteAccepted) return 'notifications.space.invite.accepted.message'
    if (inviteDeclined) {
      return !isInvitationDeclinedNotification ||
        (loginState.isLoggedIn && loginState.user.id === notification.options.user.id)
        ? 'notifications.space.invite.ignored.message'
        : 'notifications.space.invite.declined.message'
    }
    return 'notifications.space.invite.message'
  }

  const buttons = [
    <HoliButton
      key="decline"
      type="secondary"
      variant="small"
      label={t('notifications.space.invite.ignore')}
      onPress={declineInvite}
      disabled={loading}
      style={styles.button}
      testID="decline-invite-button"
    >
      {t('notifications.space.invite.ignore')}
    </HoliButton>,
    <HoliButton
      key="accept"
      type="primary"
      variant="small"
      label={t('notifications.space.invite.accept')}
      onPress={acceptInvite}
      disabled={loading}
      style={styles.button}
      testID="accept-invite-button"
    >
      {t('notifications.space.invite.accept')}
    </HoliButton>,
  ]

  if (!loginState.isLoggedIn) return <HoliLoader />

  return (
    <View testID={testID}>
      <NotificationSpaceItem
        notification={notification}
        i18nKey={getI18Key()}
        style={style}
        testID={`${testID ? testID + '-' : ''}notification-item_${loginState.user.id}_${notification.options.user.id}`}
      >
        {showButtons && (
          <HoliHorizontalRow gap={8} style={styles.buttonContainer}>
            {buttons}
          </HoliHorizontalRow>
        )}
      </NotificationSpaceItem>
      {loading && <HoliLoader testID="invite-loader-indicator" />}
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

export default NotificationSpaceInviteItem
