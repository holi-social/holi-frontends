import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import NotificationWithSpaceAvatar from '@holi/core/screens/notifications/components/NotificationWithSpaceAvatar'
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

const isNotificationInvitationDeclined = ({ notificationType }: NotificationSpaceConnection) =>
  notificationType === NotificationType.COMMUNITY_INVITE_DECLINED

const NotificationSpaceInviteItem: React.VFC<NotificationProps<NotificationSpaceConnection>> = ({
  notification,
  style,
  testID,
}) => {
  const isInvitationDeclinedNotification = isNotificationInvitationDeclined(notification)
  const [inviteAccepted, setInviteAccepted] = useState<boolean>(false)
  const [inviteDeclined, setInviteDeclined] = useState<boolean>(isInvitationDeclinedNotification)
  const { t } = useTranslation()

  const { displayError } = useErrorHandling()

  const { userId } = useAuth()

  const [updateSpaceUserConnection, { loading }] = useMutation<UpdateSpaceUserConnectionResponse>(
    updateSpaceUserConnectionMutation,
    {
      variables: {
        spaceId: notification.options.space.id,
      },
      onError(error) {
        if (error.message.includes('User did not request membership')) {
          displayError(error, t('spaces.membership.update.not-requested'))
        } else {
          displayError(error, t('spaces.membership.update.error'))
        }
      },
      refetchQueries: [{ query: discoverSpacesQuery }, { query: mySpaceQuery }],
    }
  )

  const approveConnectionRequest = () => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.CONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
      },
    }).then(() => setInviteAccepted(true))
  }

  const rejectConnectionRequest = () => {
    updateSpaceUserConnection({
      variables: {
        connectAction: SpaceConnectionAction.DISCONNECT,
        connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
      },
    }).then(() => setInviteDeclined(true))
  }

  const getI18Key = () => {
    if (inviteAccepted) return 'notifications.space.invite.accepted.message'
    if (inviteDeclined) {
      return !isInvitationDeclinedNotification || userId === notification.options.user.id
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
      onPress={() => rejectConnectionRequest()}
      disabled={loading}
      style={styles.button}
      testID="ignore-invite-request-button"
    >
      {t('notifications.space.invite.ignore')}
    </HoliButton>,
    <HoliButton
      key="accept"
      type="primary"
      variant="small"
      label={t('notifications.space.invite.accept')}
      onPress={() => approveConnectionRequest()}
      disabled={loading}
      style={styles.button}
      testID="accept-invite-request-button"
    >
      {t('notifications.space.invite.accept')}
    </HoliButton>,
  ]

  return (
    <View testID={testID}>
      <NotificationWithSpaceAvatar
        notification={notification}
        i18nKey={getI18Key()}
        style={style}
        testID={`${testID ? testID + '-' : ''}notification-item_${userId}_${notification.options.user.id}`}
      >
        {!inviteDeclined && !inviteAccepted && (
          <HoliHorizontalRow gap={8} style={styles.buttonContainer}>
            {buttons}
          </HoliHorizontalRow>
        )}
      </NotificationWithSpaceAvatar>
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
