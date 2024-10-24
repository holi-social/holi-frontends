import React from 'react'

import { NotificationChallengesItem } from '@holi/core/screens/notifications/components/NotificationChallengesItem'
import NotificationCommentReactionItem from '@holi/core/screens/notifications/components/NotificationCommentReactionItem'
import NotificationConnectionItem from '@holi/core/screens/notifications/components/NotificationConnectionItem'
import NotificationPollUpdatesItem from '@holi/core/screens/notifications/components/NotificationPollUpdatesItem'
import NotificationPostItem from '@holi/core/screens/notifications/components/NotificationPostItem'
import NotificationPostReactionItem from '@holi/core/screens/notifications/components/NotificationPostReactionItem'
import NotificationReleaseInfoItem from '@holi/core/screens/notifications/components/NotificationReleaseInfoItem'
import NotificationSpaceAppointmentDeletionItem from '@holi/core/screens/notifications/components/NotificationSpaceAppointmentDeletionItem'
import NotificationSpaceAppointmentItem from '@holi/core/screens/notifications/components/NotificationSpaceAppointmentItem'
import NotificationSpaceConnectionItem from '@holi/core/screens/notifications/components/NotificationSpaceConnectionItem'
import NotificationSpaceInviteItem from '@holi/core/screens/notifications/components/NotificationSpaceInviteItem'
import NotificationSpaceItem from '@holi/core/screens/notifications/components/NotificationSpaceItem'
import NotificationSpacePermissionsItem from '@holi/core/screens/notifications/components/NotificationSpacePermissionsItem'
import NotificationSpacePostItem from '@holi/core/screens/notifications/components/NotificationSpacePostItem'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
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
  NotificationType.COMMUNITY_MEMBERSHIP_REQUEST,
  NotificationType.COMMUNITY_MEMBERSHIP_APPROVED,
  NotificationType.COMMUNITY_MEMBERSHIP_REVOKED,
  NotificationType.RELEASE_INFO,
  NotificationType.COMMUNITY_ADMIN_PRIVILEGES_GRANTED,
  NotificationType.COMMUNITY_ADMIN_PRIVILEGES_REVOKED,
  NotificationType.COMMUNITY_INVITE,
  NotificationType.COMMUNITY_INVITE_DECLINED,
  NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
  NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_USER,
  NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_ADMIN,
  NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_USER,
  NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_ADMIN,
  NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_USER,
  NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_ADMIN,
  NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_USER,
  NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_ADMIN,
  NovuNotificationType.SPACE_MEMBERSHIP_INVITE,
  NovuNotificationType.POST_COMMENT_MENTION,
  NovuNotificationType.POST_COMMENT_AUTHOR,
  NovuNotificationType.SPACE_NEW_POST,
  NovuNotificationType.SPACE_APPOINTMENT_CREATION,
  NovuNotificationType.SPACE_APPOINTMENT_UPDATE,
  NovuNotificationType.SPACE_APPOINTMENT_DELETION,
  NovuNotificationType.CHALLENGE_APPROVAL,
  NovuNotificationType.CHALLENGE_NEW_COMMENT,
  NovuNotificationType.CHALLENGE_KEEP_STREAK,
  NovuNotificationType.CHALLENGE_LEVEL_UP_HOLI_QUEST,
  NovuNotificationType.CHALLENGE_EVENT_END,
  NovuNotificationType.CHALLENGE_EVENT_SUMMARY,
  NovuNotificationType.POLL_UPDATES,
  NovuNotificationType.POST_REACTION,
  NovuNotificationType.COMMENT_REACTION,
]

const NotificationItem: React.FC<NotificationProps> = ({ notification, ...props }) => {
  const { notificationType } = notification

  switch (notificationType) {
    case NotificationType.CONNECTION_REQUEST:
    case NotificationType.CONNECTION_ACCEPTED:
    case NotificationType.CONNECTION_CONFIRMED:
      return <NotificationConnectionItem notification={notification} {...props} testID="connection" />
    case NovuNotificationType.POST_COMMENT_MENTION:
    case NovuNotificationType.POST_COMMENT_AUTHOR:
      return <NotificationPostItem notification={notification} {...props} testID="post-comment" />
    case NotificationType.COMMUNITY_MEMBERSHIP_REQUEST:
    case NotificationType.COMMUNITY_MEMBERSHIP_APPROVED:
    case NotificationType.COMMUNITY_MEMBERSHIP_REVOKED:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST:
      return <NotificationSpaceConnectionItem notification={notification} {...props} testID="space-connection" />
    case NotificationType.COMMUNITY_INVITE:
    case NotificationType.COMMUNITY_INVITE_DECLINED:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE:
      return <NotificationSpaceInviteItem notification={notification} {...props} testID="space-invite" />
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_ADMIN:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_ADMIN:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_ADMIN:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_ADMIN:
      return <NotificationSpaceItem notification={notification} {...props} testID={'space-membership-item'} />
    case NovuNotificationType.SPACE_NEW_POST:
      return <NotificationSpacePostItem notification={notification} {...props} testID="space-post" />
    case NotificationType.RELEASE_INFO:
      return <NotificationReleaseInfoItem notification={notification} {...props} testID="release-info" />
    case NotificationType.COMMUNITY_ADMIN_PRIVILEGES_GRANTED:
    case NotificationType.COMMUNITY_ADMIN_PRIVILEGES_REVOKED:
      return <NotificationSpacePermissionsItem notification={notification} {...props} testID="space-permissions" />
    case NovuNotificationType.SPACE_APPOINTMENT_CREATION:
    case NovuNotificationType.SPACE_APPOINTMENT_UPDATE:
      return <NotificationSpaceAppointmentItem notification={notification} testID={'space-appointment'} />
    case NovuNotificationType.SPACE_APPOINTMENT_DELETION:
      return (
        <NotificationSpaceAppointmentDeletionItem notification={notification} testID={'space-appointment-deletion'} />
      )
    case NovuNotificationType.CHALLENGE_NEW_COMMENT:
    case NovuNotificationType.CHALLENGE_KEEP_STREAK:
    case NovuNotificationType.CHALLENGE_LEVEL_UP_HOLI_QUEST:
    case NovuNotificationType.CHALLENGE_APPROVAL:
    case NovuNotificationType.CHALLENGE_EVENT_END:
    case NovuNotificationType.CHALLENGE_EVENT_SUMMARY:
      return <NotificationChallengesItem notification={notification} {...props} />
    case NovuNotificationType.POLL_UPDATES:
      return <NotificationPollUpdatesItem notification={notification} {...props} />
    case NovuNotificationType.POST_REACTION:
      return <NotificationPostReactionItem notification={notification} {...props} />
    case NovuNotificationType.COMMENT_REACTION:
      return <NotificationCommentReactionItem notification={notification} {...props} />
    default:
      return null
  }
}

export default NotificationItem
