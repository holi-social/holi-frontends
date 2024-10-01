import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'

export interface PushNotificationBase<TData> {
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
