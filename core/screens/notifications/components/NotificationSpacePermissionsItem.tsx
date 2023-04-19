import React from 'react'
import { View } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import NotificationWithSpaceAvatar from '@holi/core/screens/notifications/components/NotificationWithSpaceAvatar'
import {
  NotificationProps,
  NotificationSpacePermissions,
  NotificationType,
} from '@holi/core/screens/notifications/components/types'

const NotificationSpacePermissionsItem: React.VFC<NotificationProps<NotificationSpacePermissions>> = ({
  notification,
  style,
  testID,
}) => {
  const { userId } = useAuth()

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const assertUnreachable = (_: never): never => {
    throw new Error('Should not have reached here!')
  }

  const getI18Key = () => {
    switch (notification.notificationType) {
      case NotificationType.COMMUNITY_ADMIN_PRIVILEGES_GRANTED:
        return 'notifications.space.permissions.admin.granted.message'
      case NotificationType.COMMUNITY_ADMIN_PRIVILEGES_REVOKED:
        return 'notifications.space.permissions.admin.revoked.message'
      default:
        return assertUnreachable(notification.notificationType)
    }
  }

  return (
    <View testID={testID}>
      <NotificationWithSpaceAvatar
        notification={notification}
        i18nKey={getI18Key()}
        style={style}
        testID={`${testID ? testID + '-' : ''}notification-item_${userId}_${notification.options.user.id}`}
      />
    </View>
  )
}

export default NotificationSpacePermissionsItem
