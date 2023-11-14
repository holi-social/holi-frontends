import type { NotificationResponse, PushNotificationTrigger } from 'expo-notifications'

import { logError } from '@holi/core/errors/helpers'
import { logDebug } from '@holi/core/helpers/logging'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import { SpaceMembershipPushNotification } from '@holi/mobile/notifications/spacePushNotifications'

export type NotificationPayload = Record<string, unknown>

const extractPayloadFromNotification = (response: Partial<NotificationResponse>): NotificationPayload | undefined => {
  const request = response?.notification?.request
  if (request?.trigger?.type === 'push') {
    // background or closed app push
    const trigger = request.trigger as Partial<PushNotificationTrigger>
    const triggerData = trigger?.remoteMessage?.data ?? trigger.payload // android ?? ios
    if (triggerData) {
      return triggerData
    }
  } else if (request?.content?.data) {
    // active app push
    return request?.content?.data
  }
}

const createUrlFromChatNotification = (data: NotificationPayload) => {
  const roomId = data?.room_id
  if (roomId && typeof roomId === 'string') {
    logDebug('createUrlFromChatNotification', 'navigating to room', roomId)
    return 'holi://chat/rooms/' + roomId
  }
}

const toSpacePendingCollaboratorsManagementUrl = (notification: SpaceMembershipPushNotification): string => {
  const parsedData =
    typeof notification?.data === 'string' ? JSON.parse(notification.data) : notification.data || notification
  const { space, user } = parsedData
  const spaceCollaboratorsUrl = `holi://spaces/${space.name}/collaborators/manage?tab=pending`
  const userParameter = user?.id ? `&userId=${user?.id}` : ''
  return spaceCollaboratorsUrl + userParameter
}

const toSpaceUrl = (notification: SpaceMembershipPushNotification): string => {
  const parsedData =
    typeof notification?.data === 'string' ? JSON.parse(notification.data) : notification.data || notification
  const { space } = parsedData
  return `holi://spaces/${space.name}/`
}

const spaceMemberShipUrlFrom = (notification: SpaceMembershipPushNotification) => {
  try {
    switch (notification.notificationType) {
      case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST:
        return toSpacePendingCollaboratorsManagementUrl(notification)
      case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_USER:
      case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_ADMIN:
      case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_ADMIN:
      case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_USER:
      case NovuNotificationType.SPACE_MEMBERSHIP_INVITE:
      case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_USER:
      case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_ADMIN:
      case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_USER:
      case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_ADMIN:
        return toSpaceUrl(notification)
    }
  } catch (error) {
    logError(error, 'Failed to create url for space membership notification', {
      location: 'notifications.createUrlFromSpaceMembershipNotification',
    })
  }
}

export const transformPushInteractionToUrl = (response: Partial<NotificationResponse>) => {
  const payload: NotificationPayload | undefined = extractPayloadFromNotification(response)
  if (!payload) {
    return null
  }
  switch (payload.notificationType) {
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_ADMIN:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_ADMIN:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_ADMIN:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_ADMIN:
      return spaceMemberShipUrlFrom(payload as unknown as SpaceMembershipPushNotification)
    default:
      // Default is chat notification
      return createUrlFromChatNotification(payload)
  }
}
