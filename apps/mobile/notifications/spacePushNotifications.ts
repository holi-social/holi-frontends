import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import { SpaceMembershipNotificationData } from '@holi/core/screens/notifications/components/types'

interface PushNotificationBase {
  notificationVersion: string
  aps: {
    alert: {
      title: string
      body: string
    }
  }
}

export interface SpaceMembershipPushNotification extends PushNotificationBase {
  notificationType: NovuNotificationType
  data: string /* Android */ | SpaceMembershipNotificationData
}
