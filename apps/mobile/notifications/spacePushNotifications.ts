import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import {
  PostCommentNotificationData,
  SpaceMembershipNotificationData,
  SpacePostNotificationData,
} from '@holi/core/screens/notifications/components/types'

interface PushNotificationBase<TData> {
  notificationVersion: string
  notificationType: NovuNotificationType
  data: string /* Android */ | TData
  aps: {
    alert: {
      title: string
      body: string
    }
  }
}

export type SpaceMembershipPushNotification = PushNotificationBase<SpaceMembershipNotificationData>
export type PostCommentPushNotification = PushNotificationBase<PostCommentNotificationData>
export type SpacePostPushNotification = PushNotificationBase<SpacePostNotificationData>
