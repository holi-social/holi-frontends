import React from 'react'

import NotificationConnectionItem from '@holi/core/screens/notifications/components/NotificationConnectionItem'
import NotificationPostItem from '@holi/core/screens/notifications/components/NotificationPostItem'
import { NotificationProps, NotificationType } from '@holi/core/screens/notifications/components/types'

/**
 * This const is used to distinct displayed and
 * not displayed notification in the overview.
 *
 * Keep the const always actual!
 */
export const SHOWN_NOTIFICATIONS = [
  NotificationType.CONNECTION_REQUEST,
  NotificationType.CONNECTION_ACCEPTED,
  NotificationType.CONNECTION_CONFIRMED,
  NotificationType.POST_COMMENT_USER_MENTION,
]

const NotificationItem: React.VFC<NotificationProps> = ({ notification, ...props }) => {
  const { notificationType } = notification

  switch (notificationType) {
    case NotificationType.CONNECTION_REQUEST:
    case NotificationType.CONNECTION_ACCEPTED:
    case NotificationType.CONNECTION_CONFIRMED:
      return <NotificationConnectionItem notification={notification} {...props} testID="connection" />

    case NotificationType.POST_COMMENT_USER_MENTION:
      return <NotificationPostItem notification={notification} {...props} testID="post-comment-mention" />

    default:
      return null
  }
}

export default NotificationItem
