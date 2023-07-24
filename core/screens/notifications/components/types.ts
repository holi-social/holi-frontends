import { StyleProp, ViewStyle } from 'react-native'

import { Post } from '@holi/core/screens/posts/types'
import { Space } from '@holi/core/screens/spaces/types'
import { User } from '@holi/core/screens/userprofile/types'

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
  POST_USER_MENTION = 'PUM',
  POST_COMMENT_USER_MENTION = 'PCUM',
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
  notificationType: NotificationType
  owner: User
  read: boolean
  created: string
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

export interface NotificationPost extends NotificationBase {
  notificationType:
    | NotificationType.POST_COMMENT
    | NotificationType.POST_COMMENT_REACTION
    | NotificationType.POST_COMMENT_REPLY
    | NotificationType.POST_COMMENT_USER_MENTION
    | NotificationType.POST_REACTION
    | NotificationType.POST_USER_MENTION
  options: {
    user: User

    postComment: {
      id: string
      text: string
      post: {
        id: string
      }
    }
  }
}

export interface NotificationSpaceConnection extends NotificationBase {
  notificationType:
    | NotificationType.COMMUNITY_MEMBERSHIP_APPROVED
    | NotificationType.COMMUNITY_MEMBERSHIP_REQUEST
    | NotificationType.COMMUNITY_MEMBERSHIP_REVOKED
    | NotificationType.COMMUNITY_INVITE
  options: {
    user: User
    space: Space
    message: string
  }
}

export interface NotificationSpacePost extends NotificationBase {
  notificationType: NotificationType.COMMUNITY_NEW_POST
  options: {
    space: Space
    post: Post
    teaser: string
  }
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

// this type is UNION, so extend it with "NotificationConnection | NotificationPostComment | ..."
export type NotificationWithUser =
  | NotificationConnection
  | NotificationPost
  | NotificationSpaceConnection
  | NotificationSpacePermissions
export type Notification = NotificationWithUser | NotificationReleaseInfo | NotificationSpacePost

export interface NotificationProps<T = Notification> {
  notification: T
  style?: StyleProp<ViewStyle>
  testID?: string
}
