import {
  CommentReactionNotificationData,
  PostReactionNotificationData,
} from '@holi/core/screens/notifications/components/types'
import { PushNotificationBase } from '@holi/mobile/notifications/types'

export type PostReactionPushNotification = PushNotificationBase<PostReactionNotificationData>
export type CommentReactionPushNotification = PushNotificationBase<CommentReactionNotificationData>
