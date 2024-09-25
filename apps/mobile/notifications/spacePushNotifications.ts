import {
  PostCommentNotificationData,
  SpaceMembershipNotificationData,
  SpacePostNotificationData,
} from '@holi/core/screens/notifications/components/types'
import { PushNotificationBase } from '@holi/mobile/notifications/types'

export type SpaceMembershipPushNotification = PushNotificationBase<SpaceMembershipNotificationData>
export type PostCommentPushNotification = PushNotificationBase<PostCommentNotificationData>
export type SpacePostPushNotification = PushNotificationBase<SpacePostNotificationData>
