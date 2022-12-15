import React from 'react'

import NotificationConnectionItem from '@holi/core/screens/notifications/components/NotificationConnectionItem'
import NotificationPostItem from '@holi/core/screens/notifications/components/NotificationPostItem'
import { NotificationProps, NotificationType } from '@holi/core/screens/notifications/components/types'

const NotificationItem: React.VFC<NotificationProps> = ({ notification, ...props }) => {
  const { notificationType } = notification

  switch (notificationType) {
    case NotificationType.CONNECTION_REQUEST:
    case NotificationType.CONNECTION_CONFIRMED:
      return <NotificationConnectionItem notification={notification} {...props} />

    case NotificationType.POST_COMMENT:
      return <NotificationPostItem notification={notification} {...props} />

    default:
      return null
  }
}

export default NotificationItem
