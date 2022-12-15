import { StyleProp, ViewStyle } from 'react-native'

import { User } from '@holi/core/screens/userprofile/types'

export enum NotificationType {
  POST_REACTION = 'PR',
  POST_COMMENT = 'PC',
  POST_COMMENT_REPLY = 'PCR',
  POST_COMMENT_REACTION = 'PCRA',
  CONNECTION_REQUEST = 'CR',
  CONNECTION_CONFIRMED = 'CC',
  FOLLOW = 'F',
  FOLLOW_REQUEST = 'FR',
  FOLLOW_REQUEST_APPROVED = 'FRA',
  COMMUNITY_INVITE = 'CI',
  POST_USER_MENTION = 'PUM',
  POST_COMMENT_USER_MENTION = 'PCUM',
  COMMUNITY_NEW_POST = 'CNP',
  USER_NEW_POST = 'UNP',
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
  notificationType: NotificationType.CONNECTION_REQUEST | NotificationType.CONNECTION_CONFIRMED
  options: {
    user: User
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
    post: {
      id: string
    }
    postComment: {
      id: string
    }
  }
}

// this type is UNION, so extend it with "NotificationConnection | NotificationPostComment | ..."
export type Notification = NotificationConnection | NotificationPost

export interface NotificationProps<T = Notification> {
  notification: T
  style?: StyleProp<ViewStyle>
}
