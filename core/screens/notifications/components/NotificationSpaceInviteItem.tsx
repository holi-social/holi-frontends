import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import NotificationWithSpaceAvatar from '@holi/core/screens/notifications/components/NotificationWithSpaceAvatar'
import { NotificationProps, NotificationSpaceConnection } from '@holi/core/screens/notifications/components/types'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'

const NotificationSpaceInviteItem: React.VFC<NotificationProps<NotificationSpaceConnection>> = ({
  notification,
  style,
  testID,
}) => {
  const { t } = useTranslation()

  const showToast = useToastForNotAvailableFeature()

  const { userId } = useAuth()

  // TODO: apply other keys (accepted/declined) once feature is implemented
  const getI18Key = () => 'notifications.space.invite.message'

  const buttons = [
    <HoliButton
      key="decline"
      type="secondary"
      variant="small"
      label={t('notifications.space.invite.ignore')}
      onPress={showToast}
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
      onPress={showToast}
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
        {
          <HoliHorizontalRow gap={8} style={styles.buttonContainer}>
            {buttons}
          </HoliHorizontalRow>
        }
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
