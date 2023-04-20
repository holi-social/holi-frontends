import React from 'react'

import NotificationConnectionItem from '@holi/core/screens/notifications/components/NotificationConnectionItem'
import NotificationPostItem from '@holi/core/screens/notifications/components/NotificationPostItem'
import NotificationReleaseInfoItem from '@holi/core/screens/notifications/components/NotificationReleaseInfoItem'
import NotificationSpaceConnectionItem from '@holi/core/screens/notifications/components/NotificationSpaceConnectionItem'
import NotificationSpacePermissionsItem from '@holi/core/screens/notifications/components/NotificationSpacePermissionsItem'
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
  NotificationType.COMMUNITY_MEMBERSHIP_REQUEST,
  NotificationType.COMMUNITY_MEMBERSHIP_APPROVED,
  NotificationType.RELEASE_INFO,
  NotificationType.COMMUNITY_ADMIN_PRIVILEGES_GRANTED,
  NotificationType.COMMUNITY_ADMIN_PRIVILEGES_REVOKED,
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
    case NotificationType.COMMUNITY_MEMBERSHIP_REQUEST:
    case NotificationType.COMMUNITY_MEMBERSHIP_APPROVED:
      return <NotificationSpaceConnectionItem notification={notification} {...props} testID="space-connection" />
    case NotificationType.RELEASE_INFO:
      return <NotificationReleaseInfoItem notification={notification} {...props} testID="release-info" />
    case NotificationType.COMMUNITY_ADMIN_PRIVILEGES_GRANTED:
    case NotificationType.COMMUNITY_ADMIN_PRIVILEGES_REVOKED:
      return <NotificationSpacePermissionsItem notification={notification} {...props} testID="space-permissions" />

    default:
      return null
  }
}

export default NotificationItem
