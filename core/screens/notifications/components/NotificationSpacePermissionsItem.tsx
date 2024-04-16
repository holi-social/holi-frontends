import React from 'react'
import { View } from 'react-native'

import NotificationSpaceItem from '@holi/core/screens/notifications/components/NotificationSpaceItem'
import {
  NotificationProps,
  NotificationSpacePermissions,
  NotificationType,
} from '@holi/core/screens/notifications/components/types'
import { assertUnreachable } from '@holi/ui/helper/assertUnreachable'

const NotificationSpacePermissionsItem: React.FC<NotificationProps<NotificationSpacePermissions>> = ({
  notification,
  style,
  testID,
}) => {
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
      <NotificationSpaceItem
        notification={notification}
        i18nKey={getI18Key()}
        style={style}
        testID={`${testID ? testID + '-' : ''}notification-item_${notification.options.user.id}`}
      />
    </View>
  )
}

export default NotificationSpacePermissionsItem
