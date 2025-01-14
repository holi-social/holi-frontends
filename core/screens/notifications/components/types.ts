import { StyleProp, ViewStyle } from 'react-native'

import { User } from '@holi/core/domain/shared/types'
import { Appointment } from '@holi/core/screens/appointments/types'
import { Comment } from '@holi/core/screens/comments/types'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import { Post } from '@holi/core/screens/posts/types'
import { Space } from '@holi/core/screens/spaces/types'

export enum NotificationType {
  POST_REACTION = 'PR',
  POST_COMMENT = 'PC',
  POST_COMMENT_REPLY = 'PCR',
  POST_COMMENT_REACTION = 'PCRA',
  CONNECTION_REQUEST = 'CR',
  CONNECTION_ACCEPTED = 'CA',
  CONNECTION_CONFIRMED = 'CC',
  FOLLOW = 'F',
  FOLLOW_REQUEST = 'FR',
  FOLLOW_REQUEST_APPROVED = 'FRA',
  COMMUNITY_INVITE = 'CI',
  COMMUNITY_INVITE_DECLINED = 'CID',
  POST_USER_MENTION = 'PUM',
  COMMUNITY_NEW_POST = 'CNP',
  USER_NEW_POST = 'UNP',
  COMMUNITY_MEMBERSHIP_REQUEST = 'CMR',
  COMMUNITY_MEMBERSHIP_APPROVED = 'CMRA',
  COMMUNITY_MEMBERSHIP_REVOKED = 'CMRE',
  RELEASE_INFO = 'REL',
  COMMUNITY_ADMIN_PRIVILEGES_GRANTED = 'CAPG',
  COMMUNITY_ADMIN_PRIVILEGES_REVOKED = 'CAPR',
}

// interface all Notifications extend
export interface NotificationBase {
  id: string
  notificationVersion: string
  notificationType: NotificationType | NovuNotificationType
  read: boolean
  created: string
  content?: string
}

export interface NotificationConnection extends NotificationBase {
  notificationType:
    | NotificationType.CONNECTION_REQUEST
    | NotificationType.CONNECTION_ACCEPTED
    | NotificationType.CONNECTION_CONFIRMED
  options: {
    user: User
  }
}

export interface NotificationReleaseInfo extends NotificationBase {
  notificationType: NotificationType.RELEASE_INFO
  options: {
    post: Post
  }
}
export interface PostCommentNotificationData {
  user: Pick<User, 'id' | 'avatar' | 'avatarBlurhash' | 'avatarDefaultColor' | 'avatarLabel' | 'fullName' | 'firstName'>
  comment: Pick<Comment, 'id' | 'text'>
  post: Pick<Post, 'id' | 'title'>
  /* only in 1.1.0*/
  commentLink?: string
}

export interface NotificationPost extends NotificationBase {
  notificationType:
    | NotificationType.POST_COMMENT
    | NotificationType.POST_COMMENT_REACTION
    | NotificationType.POST_COMMENT_REPLY
    | NotificationType.POST_REACTION
    | NotificationType.POST_USER_MENTION
    | NovuNotificationType.POST_COMMENT_MENTION
    | NovuNotificationType.POST_COMMENT_AUTHOR
  options: PostCommentNotificationData
}

export interface SpaceMembershipNotificationData {
  user: Pick<
    User,
    'id' | 'avatar' | 'avatarBlurhash' | 'avatarDefaultColor' | 'avatarLabel' | 'fullName' | 'firstName'
  > & {
    [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }
  space: Pick<Space, 'id' | 'avatar' | 'avatarBlurhash' | 'avatarDefaultColor' | 'title' | 'name'> & {
    [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }
  message?: string
  requestMessage?: string
}

export interface NotificationSpaceConnection extends NotificationBase {
  notificationType:
    | NotificationType.COMMUNITY_MEMBERSHIP_APPROVED
    | NotificationType.COMMUNITY_MEMBERSHIP_REQUEST
    | NotificationType.COMMUNITY_MEMBERSHIP_REVOKED
    | NotificationType.COMMUNITY_INVITE
    | NotificationType.COMMUNITY_INVITE_DECLINED
    | NovuNotificationType.SPACE_MEMBERSHIP_REQUEST
    | NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_USER
    | NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_ADMIN
    | NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_USER
    | NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_ADMIN
    | NovuNotificationType.SPACE_MEMBERSHIP_INVITE
    | NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_USER
    | NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_ADMIN
    | NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_USER
    | NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_ADMIN
  options: SpaceMembershipNotificationData
}

export interface SpacePostNotificationData {
  user: Pick<User, 'id' | 'avatar' | 'avatarBlurhash' | 'avatarDefaultColor' | 'avatarLabel' | 'fullName' | 'firstName'>
  space: Pick<Space, 'id' | 'avatar' | 'avatarBlurhash' | 'avatarDefaultColor' | 'title' | 'name'>
  post: Pick<Post, 'id' | 'title' | 'isPublic'>
}
export interface NotificationSpacePost extends NotificationBase {
  notificationType: NotificationType.COMMUNITY_NEW_POST | NovuNotificationType.SPACE_NEW_POST
  options: SpacePostNotificationData
}

export interface NotificationSpacePermissions extends NotificationBase {
  notificationType:
    | NotificationType.COMMUNITY_ADMIN_PRIVILEGES_GRANTED
    | NotificationType.COMMUNITY_ADMIN_PRIVILEGES_REVOKED
  options: {
    user: User
    space: Space
  }
}

export interface SpaceAppointmentNotificationData {
  space: Pick<Space, 'id' | 'avatar' | 'avatarBlurhash' | 'avatarDefaultColor' | 'title' | 'name'>
  appointment: Pick<Appointment, 'id' | 'title' | 'description' | 'locationDetails' | 'startDateTime' | 'endDateTime'>
  link: string
}

export interface NotificationAppointments extends NotificationBase {
  notificationType:
    | NovuNotificationType.SPACE_APPOINTMENT_CREATION
    | NovuNotificationType.SPACE_APPOINTMENT_UPDATE
    | NovuNotificationType.SPACE_APPOINTMENT_DELETION
  options: SpaceAppointmentNotificationData
}

export interface ChallengeNotificationData {
  link: string
}

export interface NotificationChallenges extends NotificationBase {
  notificationType:
    | NovuNotificationType.CHALLENGE_APPROVAL
    | NovuNotificationType.CHALLENGE_NEW_COMMENT
    | NovuNotificationType.CHALLENGE_KEEP_STREAK
    | NovuNotificationType.CHALLENGE_LEVEL_UP_HOLI_QUEST
    | NovuNotificationType.CHALLENGE_EVENT_END
    | NovuNotificationType.CHALLENGE_EVENT_SUMMARY
    | NovuNotificationType.CHALLENGE_EVENT_STARTING_TOMORROW
    | NovuNotificationType.CHALLENGE_EVENT_STARTS_NOW
  options: ChallengeNotificationData
}

export interface PollData {
  poll: { id: string; title: string; insightId: string }
}

export interface NotificationPolls extends NotificationBase {
  notificationType: NovuNotificationType.POLL_UPDATES
  options: PollData
}
// this type is UNION, so extend it with "NotificationConnection | NotificationPostComment | ..."
export type NotificationWithUser =
  | NotificationConnection
  | NotificationPost
  | NotificationSpaceConnection
  | NotificationSpacePermissions
  | NotificationPostReactions
  | NotificationCommentReactions
export type Notification =
  | NotificationWithUser
  | NotificationReleaseInfo
  | NotificationSpacePost
  | NotificationAppointments
  | NotificationChallenges
  | NotificationPolls

export interface NotificationProps<T = Notification> {
  notification: T
  style?: StyleProp<ViewStyle>
  testID?: string
  link?: string
}

export interface PostReactionNotificationData {
  user: Pick<User, 'id' | 'avatar' | 'avatarBlurhash' | 'avatarDefaultColor' | 'avatarLabel' | 'fullName' | 'firstName'>
  post: Pick<Post, 'id' | 'title'>
}

export interface NotificationPostReactions extends NotificationBase {
  notificationType: NovuNotificationType.POST_REACTION
  options: PostReactionNotificationData
}

export interface CommentReactionNotificationData {
  user: Pick<User, 'id' | 'avatar' | 'avatarBlurhash' | 'avatarDefaultColor' | 'avatarLabel' | 'fullName' | 'firstName'>
  comment: Pick<Comment, 'id'> & { link: string }
}

export interface NotificationCommentReactions extends NotificationBase {
  notificationType: NovuNotificationType.COMMENT_REACTION
  options: CommentReactionNotificationData
}
